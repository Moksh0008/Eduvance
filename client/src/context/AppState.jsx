import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { clearAuth, fetchMe, loadAuth, loginAccount, registerAccount } from '../services/auth'
import { emptyWorkspace, loadWorkspace } from '../services/workspace'
import { loadUi, saveUi } from '../services/storage'
import { PrepAction, preparationReducer } from '../services/preparationReducer'
import { pullPreparation, pushPreparation } from '../services/sync'

const AppStateContext = createContext(null)

export function AppStateProvider({ children }) {
  const [session, setSession] = useState(() => loadAuth())
  const [workspace, dispatch] = useReducer(preparationReducer, null, loadWorkspace)
  const [ui, setUi] = useState(() => loadUi())
  const [bootstrapped, setBootstrapped] = useState(!loadAuth()?.token)

  const apply = useCallback(
    (action, { persist = true } = {}) => {
      const next = preparationReducer(workspace, action)
      dispatch({ type: PrepAction.HYDRATE, payload: next })
      if (persist && session?.token && action.type !== PrepAction.HYDRATE) {
        pushPreparation(next).catch((err) => console.error('Failed to sync preparation', err))
      }
      return next
    },
    [workspace, session?.token],
  )

  useEffect(() => {
    let cancelled = false
    async function boot() {
      const stored = loadAuth()
      if (!stored?.token) {
        dispatch({ type: PrepAction.HYDRATE, payload: emptyWorkspace() })
        setBootstrapped(true)
        return
      }
      // Set token immediately so UI can render
      setSession(stored)

      // Race: try to fetch user data with 8s timeout
      // If backend is waking up, show cached data immediately
      try {
        const fetchPromise = fetchMe()
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 8000)
        )
        const me = await Promise.race([fetchPromise, timeoutPromise])
        if (cancelled) return
        setSession((prev) => ({ ...prev, user: me.user }))
        // Fetch preparation data in background (non-blocking)
        pullPreparation()
          .then((prep) => {
            if (!cancelled) dispatch({ type: PrepAction.HYDRATE, payload: prep })
          })
          .catch(() => {
            // Token invalid or server unreachable — clear stale auth
            clearAuth()
            setSession(null)
          })
      } catch (err) {
        if (cancelled) return
        // Token invalid or backend unreachable — clear stale auth so login/register pages show clean
        clearAuth()
        setSession(null)
      } finally {
        if (!cancelled) setBootstrapped(true)
      }
    }
    boot()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const next = await loginAccount({ email, password })
    setSession(next)
    try {
      const prep = await pullPreparation()
      dispatch({ type: PrepAction.HYDRATE, payload: prep })
      return { session: next, workspace: prep }
    } catch {
      // pullPreparation failed — proceed with empty workspace
      dispatch({ type: PrepAction.HYDRATE, payload: emptyWorkspace() })
      return { session: next, workspace: emptyWorkspace() }
    }
  }, [])

  const register = useCallback(async ({ name, email, password }) => {
    const next = await registerAccount({ name, email, password })
    setSession(next)
    try {
      const prep = await pullPreparation()
      dispatch({ type: PrepAction.HYDRATE, payload: prep })
      return { session: next, workspace: prep }
    } catch {
      // pullPreparation failed — proceed with empty workspace
      dispatch({ type: PrepAction.HYDRATE, payload: emptyWorkspace() })
      return { session: next, workspace: emptyWorkspace() }
    }
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setSession(null)
    dispatch({ type: PrepAction.HYDRATE, payload: emptyWorkspace() })
  }, [])

  const completeOnboarding = useCallback(
    async (data) => {
      const next = apply(
        {
          type: PrepAction.COMPLETE_SETUP,
          payload: {
            ...data,
            student: {
              name: session?.user?.name || data.student?.name || 'Student',
              email: session?.user?.email || data.student?.email || '',
            },
          },
        },
        { persist: false },
      )
      // Save to MongoDB in background — never block navigation
      if (session?.token) {
        (async () => {
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              await pushPreparation(next)
              console.log('[Setup] Preparation saved to server successfully')
              return
            } catch (err) {
              console.error(`[Setup] Save attempt ${attempt + 1} failed:`, err.message)
              if (attempt < 2) await new Promise(r => setTimeout(r, 2000 * (attempt + 1)))
            }
          }
          console.error('[Setup] All save attempts failed — data saved locally')
        })()
      }
      return next
    },
    [apply, session],
  )

  const recordQuiz = useCallback(
    async (result) => {
      const next = apply({ type: PrepAction.RECORD_QUIZ, payload: result }, { persist: false })
      if (session?.token) await pushPreparation(next)
      return next
    },
    [apply, session?.token],
  )

  const enableDemo = useCallback(() => {
    setUi(saveUi({ ...loadUi(), demoMode: true }))
  }, [])

  const disableDemo = useCallback(() => {
    setUi(saveUi({ ...loadUi(), demoMode: false }))
  }, [])

  const updateWorkspace = useCallback(
    (patch) => apply({ type: PrepAction.PATCH, payload: patch }),
    [apply],
  )

  const replaceWorkspace = useCallback(
    (next) => apply({ type: PrepAction.REPLACE, payload: next }),
    [apply],
  )

  const setupCompleted = Boolean(workspace.setupCompleted || workspace.onboardingComplete)
  const demoMode = Boolean(ui.demoMode)

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      isLoggedIn: Boolean(session?.token && session?.user),
      workspace,
      demoMode,
      setupCompleted,
      onboardingComplete: setupCompleted,
      bootstrapped,
      login,
      register,
      logout,
      completeOnboarding,
      recordQuiz,
      enableDemo,
      disableDemo,
      updateWorkspace,
      replaceWorkspace,
    }),
    [
      session,
      workspace,
      demoMode,
      setupCompleted,
      bootstrapped,
      login,
      register,
      logout,
      completeOnboarding,
      recordQuiz,
      enableDemo,
      disableDemo,
      updateWorkspace,
      replaceWorkspace,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}

export function useAuth() {
  const { user, isLoggedIn, login, register, logout } = useAppState()
  return { user, isLoggedIn, login, register, logout }
}
