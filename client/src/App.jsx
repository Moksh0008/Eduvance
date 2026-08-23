import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppShell } from './components/layout/AppShell'
import { LandingPage } from './pages/LandingPage'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import { AuthCallback } from './pages/AuthCallback'
import VerifyOTP from './pages/VerifyOTP'
import { DashboardPage } from './pages/DashboardPage'
import { PlannerPage } from './pages/PlannerPage'
import { SyllabusPage } from './pages/SyllabusPage'
import { ProgressPage } from './pages/ProgressPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { SubjectsPage } from './pages/SubjectsPage'
import { TimetablePage } from './pages/TimetablePage'
import { QuestionPapersPage } from './pages/QuestionPapersPage'
import { warmBackend } from './services/warmup'
import { StudySessionPage } from './pages/StudySessionPage'
import { SetupPage } from './pages/SetupPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'
import { QuizPage } from './pages/QuizPage'
import { QuizPlayPage } from './pages/QuizPlayPage'
import { QuizResultPage } from './pages/QuizResultPage'
import { InsightsPage } from './pages/InsightsPage'
import { RevisionPage } from './pages/RevisionPage'
import { TheLoopPage } from './pages/TheLoopPage'
import { ProblemPage } from './pages/ProblemPage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { WhyEduvancePage } from './pages/WhyEduvancePage'
import { PageTransition } from './components/ui/PageTransition'
import { RequireAuth } from './components/auth/RequireAuth'
import { EduvanceMascot } from './components/mascot/EduvanceMascot'
import SessionTimeout from './components/ui/SessionTimeout'

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

  return (
    <>
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
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
    {!['/login', '/register', '/verify-email', '/forgot-password'].includes(location.pathname) && <EduvanceMascot />}
    <SessionTimeout />
    </>
  )
}

// redeploy Sun Aug 23 17:08:15 IST 2026
// rebuild 1787486873
// full audit 1787488763
// force redeploy 1787502817
