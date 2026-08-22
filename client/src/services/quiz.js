import { getQuizBank } from './catalog'
import { getQuestions, getAvailableTopics, adaptDifficulty } from './questionBank'

/**
 * Build quiz questions for a topic.
 * Uses the real question bank when available, falls back to self-assessment.
 */
export function buildTopicQuiz(topicName, count = 10, subject = '', difficulty = 'medium') {
  // Try the real question bank first
  if (subject) {
    const realQuestions = getQuestions(subject, topicName, difficulty, count)
    if (realQuestions.length > 0) return realQuestions
  }

  // Fallback: self-assessment questions
  const topic = topicName || 'this topic'
  const stems = [
    [`I can explain ${topic} clearly, without notes.`, ['No', 'Somewhat', 'Yes'], 2],
    [`I can state the key definitions used in ${topic}.`, ['No', 'Partially', 'Yes'], 2],
    [`I can solve a typical exam problem on ${topic}.`, ['No', 'With notes', 'Yes'], 2],
    [`I can compare ${topic} with a closely related idea.`, ['No', 'Somewhat', 'Yes'], 2],
    [`I can list common mistakes students make on ${topic}.`, ['No', 'One or two', 'Yes'], 2],
    [`I can apply ${topic} to a new scenario.`, ['No', 'With hints', 'Yes'], 2],
    [`I can recall the standard steps/algorithm for ${topic}.`, ['No', 'Partially', 'Yes'], 2],
    [`I can teach ${topic} to a peer in under ten minutes.`, ['No', 'Roughly', 'Yes'], 2],
    [`I know which exam questions usually test ${topic}.`, ['No', 'Somewhat', 'Yes'], 2],
    [`I am ready to sit a timed question on ${topic} today.`, ['No', 'Almost', 'Yes'], 2],
  ]
  return stems.slice(0, count).map((row, i) => ({
    id: `q-${i + 1}`,
    prompt: row[0],
    options: row[1],
    answer: row[2],
    difficulty: 'self-assessment',
    subject,
    topic: topicName,
  }))
}

/**
 * Check if real MCQ questions are available for a subject/topic
 */
export function hasRealQuestions(subject, topic) {
  const questions = getQuestions(subject, topic, 'medium', 1)
  return questions.length > 0
}

/**
 * Get available topic names from the question bank for a subject
 */
export function getBankTopics(subject) {
  return getAvailableTopics(subject)
}

/**
 * Get adaptive difficulty based on history
 */
export function getAdaptiveDifficulty(workspace, subject, topic) {
  const history = workspace.quizResults || workspace.quizHistory || []
  const topicQuizzes = history.filter(q => q.subject === subject && q.topic === topic)
  if (topicQuizzes.length === 0) return 'easy'
  const lastScore = topicQuizzes[topicQuizzes.length - 1].score
  return adaptDifficulty(lastScore, 'medium')
}

export { getQuizBank }
