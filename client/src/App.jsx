import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { warmBackend } from './services/warmup'

// ── Eagerly loaded (critical path — instant navigation) ──
import { LandingPage } from './pages/LandingPage'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import { AuthCallback } from './pages/AuthCallback'
import { PageTransition } from './components/ui/PageTransition'
import { RequireAuth } from './components/auth/RequireAuth'
import { EduvanceMascot } from './components/mascot/EduvanceMascot'
import SessionTimeout from './components/ui/SessionTimeout'
// ── Lazily loaded (split into separate chunks) ──
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const ProgressPage = lazy(() => import('./pages/ProgressPage').then(m => ({ default: m.ProgressPage })))
const QuizPage = lazy(() => import('./pages/QuizPage').then(m => ({ default: m.QuizPage })))
const VerifyOTP = lazy(() => import('./pages/VerifyOTP'))
const SetupPage = lazy(() => import('./pages/SetupPage').then(m => ({ default: m.SetupPage })))
const PlannerPage = lazy(() => import('./pages/PlannerPage').then(m => ({ default: m.PlannerPage })))
const SyllabusPage = lazy(() => import('./pages/SyllabusPage').then(m => ({ default: m.SyllabusPage })))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })))
const SubjectsPage = lazy(() => import('./pages/SubjectsPage').then(m => ({ default: m.SubjectsPage })))
const TimetablePage = lazy(() => import('./pages/TimetablePage').then(m => ({ default: m.TimetablePage })))
const QuestionPapersPage = lazy(() => import('./pages/QuestionPapersPage').then(m => ({ default: m.QuestionPapersPage })))
const StudySessionPage = lazy(() => import('./pages/StudySessionPage').then(m => ({ default: m.StudySessionPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })))
const QuizPlayPage = lazy(() => import('./pages/QuizPlayPage').then(m => ({ default: m.QuizPlayPage })))
const QuizResultPage = lazy(() => import('./pages/QuizResultPage').then(m => ({ default: m.QuizResultPage })))
const InsightsPage = lazy(() => import('./pages/InsightsPage').then(m => ({ default: m.InsightsPage })))
const RevisionPage = lazy(() => import('./pages/RevisionPage').then(m => ({ default: m.RevisionPage })))
const TheLoopPage = lazy(() => import('./pages/TheLoopPage').then(m => ({ default: m.TheLoopPage })))
const ProblemPage = lazy(() => import('./pages/ProblemPage').then(m => ({ default: m.ProblemPage })))
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })))
const WhyEduvancePage = lazy(() => import('./pages/WhyEduvancePage').then(m => ({ default: m.WhyEduvancePage })))
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage').then(m => ({ default: m.SubscriptionPage })))
const AppShell = lazy(() => import('./components/layout/AppShell').then(m => ({ default: m.AppShell })))

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-3 border-accent border-t-transparent" />
        <p className="text-sm text-ink-3">Loading...</p>
      </div>
    </div>
  )
}

function AnimatedPage({ children }) {
  return <PageTransition>{children}</PageTransition>
}

function ProtectedShell() {
  return (
    <RequireAuth>
      <AppShell />
    </RequireAuth>
  )
}

function ProtectedSetup() {
  return (
    <RequireAuth>
      <SetupPage />
    </RequireAuth>
  )
}

export default function App() {
  const location = useLocation()
  // Warm backend on first load to prevent cold start delays
  useEffect(() => { warmBackend() }, [])

  // Prefetch the most-navigated page chunks on FIRST USER INTERACTION.
  // Keeps them out of the initial critical path (faster FCP/LCP) while
  // still making navigation instant once the user engages with the page.
  useEffect(() => {
    let done = false
    function prefetch() {
      if (done) return
      done = true
      const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1000))
      idle(() => {
        import('./pages/DashboardPage')
        import('./pages/ProgressPage')
        import('./pages/QuizPage')
      })
      remove()
    }
    function remove() {
      window.removeEventListener('pointerdown', prefetch)
      window.removeEventListener('keydown', prefetch)
      window.removeEventListener('wheel', prefetch)
      window.removeEventListener('touchstart', prefetch)
      window.removeEventListener('scroll', prefetch)
    }
    window.addEventListener('pointerdown', prefetch, { passive: true })
    window.addEventListener('keydown', prefetch)
    window.addEventListener('wheel', prefetch, { passive: true })
    window.addEventListener('touchstart', prefetch, { passive: true })
    window.addEventListener('scroll', prefetch, { passive: true })
    // Fallback so navigation is still warm even for passive users
    const timer = setTimeout(prefetch, 8000)
    return () => { remove(); clearTimeout(timer) }
  }, [])

  return (
    <Suspense fallback={<PageLoader />}>
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/the-loop" element={<TheLoopPage />} />
        <Route path="/problem" element={<ProblemPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/why-eduvance" element={<WhyEduvancePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/verify-email" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<LoginPage />} />
        <Route path="/setup" element={<ProtectedSetup />} />
        <Route element={<ProtectedShell />}>
          <Route path="/dashboard" element={<AnimatedPage><DashboardPage /></AnimatedPage>} />
          <Route path="/planner" element={<AnimatedPage><PlannerPage /></AnimatedPage>} />
          <Route path="/syllabus" element={<AnimatedPage><SyllabusPage /></AnimatedPage>} />
          <Route path="/progress" element={<AnimatedPage><ProgressPage /></AnimatedPage>} />
          <Route path="/analytics" element={<AnimatedPage><AnalyticsPage /></AnimatedPage>} />
          <Route path="/subjects" element={<AnimatedPage><SubjectsPage /></AnimatedPage>} />
          <Route path="/timetable" element={<AnimatedPage><TimetablePage /></AnimatedPage>} />
          <Route path="/question-papers" element={<AnimatedPage><QuestionPapersPage /></AnimatedPage>} />
          <Route path="/study-session" element={<AnimatedPage><StudySessionPage /></AnimatedPage>} />
          <Route path="/quiz" element={<AnimatedPage><QuizPage /></AnimatedPage>} />
          <Route path="/quiz/play" element={<AnimatedPage><QuizPlayPage /></AnimatedPage>} />
          <Route path="/quiz/result" element={<AnimatedPage><QuizResultPage /></AnimatedPage>} />
          <Route path="/insights" element={<AnimatedPage><InsightsPage /></AnimatedPage>} />
          <Route path="/revision" element={<AnimatedPage><RevisionPage /></AnimatedPage>} />
          <Route path="/profile" element={<AnimatedPage><ProfilePage /></AnimatedPage>} />
          <Route path="/settings" element={<AnimatedPage><SettingsPage /></AnimatedPage>} />
          <Route path="/subscription" element={<AnimatedPage><SubscriptionPage /></AnimatedPage>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
    {!['/login', '/register', '/verify-email', '/forgot-password'].includes(location.pathname) && <EduvanceMascot />}
    <SessionTimeout />
    </Suspense>
  )
}
