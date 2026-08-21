import { getQuizBank } from './catalog'

export function buildTopicQuiz(topicName, count = 10) {
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
  }))
}

export { getQuizBank }
