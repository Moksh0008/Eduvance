import { Navigate, Route, Routes } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppShell } from './components/layout/AppShell'
import { LandingPage } from './pages/LandingPage'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import { DashboardPage } from './pages/DashboardPage'
import { PlannerPage } from './pages/PlannerPage'
import { SyllabusPage } from './pages/SyllabusPage'
import { ProgressPage } from './pages/ProgressPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { SubjectsPage } from './pages/SubjectsPage'
import { TimetablePage } from './pages/TimetablePage'
import { QuestionPapersPage } from './pages/QuestionPapersPage'
import { StudySessionPage } from './pages/StudySessionPage'
import { SetupPage } from './pages/SetupPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'
import { QuizPage } from './pages/QuizPage'
import { QuizPlayPage } from './pages/QuizPlayPage'
import { QuizResultPage } from './pages/QuizResultPage'
import { InsightsPage } from './pages/InsightsPage'
import { RevisionPage } from './pages/RevisionPage'
import { pageFade } from './animations/variants'

function AnimatedPage({ children }) {
  return <motion.div {...pageFade}>{children}</motion.div>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route element={<AppShell />}>
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
  )
}
