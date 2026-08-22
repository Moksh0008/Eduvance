/* ═══════════════════════════════════════════════════
   MASCOT MESSAGES — Context-aware, data-driven
   ═══════════════════════════════════════════════════ */

// Pose mapping — uses the main octopus image for all poses
const OCTO_IMG = '/mascot/octo-80.webp'
export const POSES = {
  happy:        { image: OCTO_IMG, bgPos: 'center', label: 'Happy' },
  excited:      { image: OCTO_IMG, bgPos: 'center', label: 'Excited' },
  thinking:     { image: OCTO_IMG, bgPos: 'center', label: 'Thinking' },
  surprised:    { image: OCTO_IMG, bgPos: 'center', label: 'Surprised' },
  curious:      { image: OCTO_IMG, bgPos: 'center', label: 'Curious' },
  sleepy:       { image: OCTO_IMG, bgPos: 'center', label: 'Sleepy' },
  front:        { image: OCTO_IMG, bgPos: 'center', label: 'Front' },
  side:         { image: OCTO_IMG, bgPos: 'center', label: 'Side' },
  back:         { image: OCTO_IMG, bgPos: 'center', label: 'Back' },
  threeQ:       { image: OCTO_IMG, bgPos: 'center', label: '3/4 View' },
  reading:      { image: OCTO_IMG, bgPos: 'center', label: 'Reading' },
  studying:     { image: OCTO_IMG, bgPos: 'center', label: 'Studying' },
  experimenting:{ image: OCTO_IMG, bgPos: 'center', label: 'Experimenting' },
  helping:      { image: OCTO_IMG, bgPos: 'center', label: 'Helping' },
  celebrating:  { image: OCTO_IMG, bgPos: 'center', label: 'Celebrating' },
  timeToLearn:  { image: OCTO_IMG, bgPos: 'center', label: 'Time to Learn' },
  greatQuestion:{ image: OCTO_IMG, bgPos: 'center', label: 'Great Question' },
  youCanDoIt:   { image: OCTO_IMG, bgPos: 'center', label: 'You Can Do It' },
  keepGoing:    { image: OCTO_IMG, bgPos: 'center', label: 'Keep Going' },
  smallSteps:   { image: OCTO_IMG, bgPos: 'center', label: 'Small Steps' },
}

// Default pose for each page
export const PAGE_POSES = {
  '/': 'happy',
  '/login': 'front',
  '/register': 'front',
  '/dashboard': 'happy',
  '/syllabus': 'studying',
  '/subjects': 'curious',
  '/planner': 'thinking',
  '/timetable': 'thinking',
  '/revision': 'reading',
  '/quiz': 'excited',
  '/quiz/play': 'excited',
  '/quiz/result': 'celebrating',
  '/question-papers': 'reading',
  '/progress': 'excited',
  '/analytics': 'thinking',
  '/insights': 'curious',
  '/profile': 'happy',
  '/settings': 'front',
  '/study-session': 'studying',
  '/setup': 'helping',
}

// Messages per page — arrays, one shown at a time
const PAGE_MESSAGES = {
  '/': [
    "Hey! Ready to make your study plan smarter?",
    "Let's figure out what you should study next.",
    "Your preparation doesn't have to be chaotic.",
    "Give me your exam details. I'll help you organize the rest.",
  ],
  '/login': [
    "Welcome back! Your study data is safe.",
    "Ready to continue where you left off?",
  ],
  '/register': [
    "Welcome to Eduvance! Let's get started.",
    "I'll help you build a smart study plan.",
  ],
  '/dashboard': [
    "Your next priority is waiting!",
    "You're getting closer. Keep the momentum going!",
    "Want to see what you should study next?",
    "Let's make today count.",
  ],
  '/syllabus': [
    "Let's break that syllabus into manageable pieces.",
    "Don't worry — we don't have to tackle them all at once.",
    "Once I know your exam dates, I can help prioritize.",
    "Every topic you add helps me plan better.",
  ],
  '/subjects': [
    "Which subjects are giving you the most trouble?",
    "Let's find the subjects that need your attention first.",
    "Each subject has its own priority level.",
  ],
  '/planner': [
    "Let's turn your available time into a realistic plan.",
    "Don't overload today. Consistency beats cramming.",
    "Your plan can change as you improve.",
    "I'll find the best slots for each subject.",
  ],
  '/timetable': [
    "Let's organize your study blocks.",
    "Time matters. I'll help you prioritize.",
    "Your schedule reflects your priorities.",
  ],
  '/revision': [
    "Let's revisit the topics that need another look.",
    "Small revision sessions can make a big difference.",
    "Repetition is how memories get stronger.",
  ],
  '/quiz': [
    "Ready? Let's crush this quiz! 💪",
    "You've been studying hard — show what you know! 🎯",
    "Time to prove yourself. You've got this! ✨",
    "Let's see how much you've mastered! 🚀",
  ],
  '/quiz/play': [
    "Take your time.",
    "Think carefully.",
    "You've got this!",
    "Trust what you've studied.",
  ],
  '/quiz/result': [
    "Let's see how you did!",
    "Every quiz tells us something new.",
  ],
  '/question-papers': [
    "Past papers are gold — let's use them.",
    "Practice under real conditions helps.",
    "This is where theory meets reality.",
  ],
  '/progress': [
    "Look how far you've come!",
    "Your progress is building.",
    "You've completed more than you think.",
  ],
  '/analytics': [
    "Let's see what your performance is telling us.",
    "Your weak areas are becoming clearer.",
    "The numbers help us decide what comes next.",
  ],
  '/insights': [
    "I found something interesting in your preparation.",
    "Your recent performance suggests this topic needs attention.",
    "Smart students review their insights.",
  ],
  '/profile': [
    "Looking good!",
    "Keep your profile updated.",
  ],
  '/settings': [
    "Customize your experience.",
    "Small changes, big impact.",
  ],
  '/study-session': [
    "Focus mode activated.",
    "One session at a time.",
    "Let's make these minutes count.",
  ],
  '/setup': [
    "Let's set up your study profile.",
    "I need a few details to build your plan.",
    "This helps me understand your constraints.",
  ],
}

// Dynamic messages based on exam data
function getExamMessages(data) {
  if (!data?.preferences?.examDate) return null
  const daysLeft = Math.max(0, Math.ceil((new Date(data.preferences.examDate) - new Date()) / 86400000))

  if (daysLeft === 0) return { pose: 'excited', messages: ["Today is the day. Stay calm and trust your preparation."] }
  if (daysLeft <= 2) return { pose: 'surprised', messages: ["Your exam is very close. Let's focus on the highest-priority topics."] }
  if (daysLeft <= 6) return { pose: 'thinking', messages: [`Your exam is ${daysLeft} days away. Let's prioritize.`] }
  if (daysLeft <= 14) return { pose: 'thinking', messages: [`About ${daysLeft} days until your exam. Let's prepare steadily.`] }
  return null
}

// Dynamic messages based on quiz score
function getQuizScoreMessage(score) {
  if (score >= 90) return { pose: 'excited', message: "Wow! You're on fire! That's an incredible score!" }
  if (score >= 70) return { pose: 'happy', message: "Great work! Keep building on this." }
  if (score >= 50) return { pose: 'thinking', message: "Good progress. We found a few areas to strengthen." }
  return { pose: 'thinking', message: "That's okay. Now we know exactly where to focus." }
}

// Streak messages
function getStreakMessage(streakCount) {
  if (streakCount >= 7) return { pose: 'excited', message: `${streakCount} days in a row! That's impressive!` }
  if (streakCount >= 3) return { pose: 'happy', message: `${streakCount}-day streak! Keep it going!` }
  if (streakCount >= 1) return { pose: 'happy', message: "Nice! You studied today. Keep the streak alive!" }
  return null
}

/**
 * Get the best message for the current context.
 * Returns { pose, message, image, bgPos }
 */
export function getContextMessage(pathname, data = {}, extra = {}) {
  const baseMessages = PAGE_MESSAGES[pathname] || PAGE_MESSAGES['/']
  const defaultPose = PAGE_POSES.pathname || 'happy'

  // Check for quiz result
  if (pathname === '/quiz/result' && extra.quizScore != null) {
    const q = getQuizScoreMessage(extra.quizScore)
    return { pose: q.pose, message: q.message }
  }

  // Check for exam urgency
  const examMsg = getExamMessages(data)
  if (examMsg) {
    const msg = examMsg.messages[Math.floor(Math.random() * examMsg.messages.length)]
    return { pose: examMsg.pose, message: msg }
  }

  // Check for streak
  if (extra.streakCount > 0) {
    const streakMsg = getStreakMessage(extra.streakCount)
    if (streakMsg && Math.random() < 0.3) { // 30% chance to show streak message
      return { pose: streakMsg.pose, message: streakMsg.message }
    }
  }

  // Default: random page message
  const msg = baseMessages[Math.floor(Math.random() * baseMessages.length)]
  return { pose: defaultPose, message: msg }
}

export { PAGE_MESSAGES }
