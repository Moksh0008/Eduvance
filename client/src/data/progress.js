export const progressSummary = {
  overall: 72,
  hoursThisWeek: 18.5,
  hoursTarget: 24,
  topicsCompleted: 19,
  topicsTotal: 34,
  quizAverage: 64,
}

export const weakTopics = [
  { name: 'Normalization', subject: 'DBMS', mastery: 35 },
  { name: 'B+ Trees', subject: 'DBMS', mastery: 32 },
  { name: 'Graphs', subject: 'DSA', mastery: 34 },
  { name: 'Multithreading', subject: 'Java', mastery: 38 },
]

export const strongTopics = [
  { name: 'SDLC Models', subject: 'SE', mastery: 92 },
  { name: 'UML & Architecture', subject: 'SE', mastery: 86 },
  { name: 'OOP Principles', subject: 'Java', mastery: 80 },
  { name: 'ER Modelling', subject: 'DBMS', mastery: 78 },
]

export const activity = [
  { id: 'a1', text: 'Completed 45m on SQL Queries', time: 'Yesterday, 21:10' },
  { id: 'a2', text: 'Quiz: Relational Algebra — 62%', time: 'Yesterday, 18:40' },
  { id: 'a3', text: 'Plan adapted: DBMS exam in 4 days', time: 'Yesterday, 07:02' },
  { id: 'a4', text: 'Logged 2h 10m on Trees', time: '18 Aug, 16:30' },
]

export const risks = [
  {
    id: 'r1',
    title: 'DBMS coverage risk',
    body: 'Normalization and B+ Trees are both high-weight and below 40% mastery with 4 days left.',
    level: 'high',
  },
  {
    id: 'r2',
    title: 'Time allocation drift',
    body: 'SE is 94% ready but still received 3h this week. Replan shifted those hours toward DBMS.',
    level: 'medium',
  },
]
