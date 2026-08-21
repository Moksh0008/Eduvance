export const units = [
  {
    id: 'dbms-u1',
    subjectId: 'dbms',
    name: 'Unit 1 — Introduction & ER Model',
    topics: [
      { id: 't-er', name: 'ER Modelling', difficulty: 42, weightage: 8, mastery: 78, priority: 41, estimatedMin: 60, status: 'On track' },
      { id: 't-rel', name: 'Relational Model', difficulty: 48, weightage: 8, mastery: 72, priority: 44, estimatedMin: 70, status: 'On track' },
    ],
  },
  {
    id: 'dbms-u2',
    subjectId: 'dbms',
    name: 'Unit 2 — Relational Algebra & SQL',
    topics: [
      { id: 't-ra', name: 'Relational Algebra', difficulty: 62, weightage: 12, mastery: 64, priority: 58, estimatedMin: 90, status: 'Medium' },
      { id: 't-sql', name: 'SQL Queries', difficulty: 55, weightage: 14, mastery: 70, priority: 52, estimatedMin: 80, status: 'On track' },
    ],
  },
  {
    id: 'dbms-u3',
    subjectId: 'dbms',
    name: 'Unit 3 — Normalization',
    topics: [
      {
        id: 't-norm',
        name: 'Normalization',
        difficulty: 78,
        weightage: 20,
        mastery: 35,
        priority: 94,
        estimatedMin: 135,
        status: 'High Priority',
        reasons: ['High marks weightage', 'Exam approaching', 'Frequently asked', 'Low current mastery'],
      },
      { id: 't-fd', name: 'Functional Dependencies', difficulty: 74, weightage: 10, mastery: 48, priority: 81, estimatedMin: 90, status: 'High Priority' },
    ],
  },
  {
    id: 'dbms-u4',
    subjectId: 'dbms',
    name: 'Unit 4 — Transactions & Recovery',
    topics: [
      { id: 't-txn', name: 'Transactions', difficulty: 70, weightage: 12, mastery: 62, priority: 67, estimatedMin: 80, status: 'Medium' },
      { id: 't-rec', name: 'Recovery', difficulty: 76, weightage: 8, mastery: 51, priority: 72, estimatedMin: 75, status: 'Medium' },
    ],
  },
  {
    id: 'dbms-u5',
    subjectId: 'dbms',
    name: 'Unit 5 — Indexing & Storage',
    topics: [
      { id: 't-bpt', name: 'B+ Trees', difficulty: 82, weightage: 12, mastery: 32, priority: 88, estimatedMin: 100, status: 'High Priority' },
      { id: 't-hash', name: 'Hashing', difficulty: 60, weightage: 6, mastery: 55, priority: 49, estimatedMin: 50, status: 'On track' },
    ],
  },
  {
    id: 'java-u1',
    subjectId: 'java',
    name: 'Unit 1 — OOP Foundations',
    topics: [
      { id: 't-oop', name: 'OOP Principles', difficulty: 40, weightage: 10, mastery: 80, priority: 28, estimatedMin: 45, status: 'On track' },
      { id: 't-inh', name: 'Inheritance & Polymorphism', difficulty: 58, weightage: 12, mastery: 66, priority: 54, estimatedMin: 70, status: 'Medium' },
    ],
  },
  {
    id: 'java-u2',
    subjectId: 'java',
    name: 'Unit 2 — Collections & Concurrency',
    topics: [
      { id: 't-col', name: 'Collections', difficulty: 68, weightage: 16, mastery: 44, priority: 86, estimatedMin: 90, status: 'High Priority' },
      { id: 't-mt', name: 'Multithreading', difficulty: 80, weightage: 14, mastery: 38, priority: 84, estimatedMin: 100, status: 'High Priority' },
    ],
  },
  {
    id: 'dsa-u1',
    subjectId: 'dsa',
    name: 'Unit 1 — Linear & Trees',
    topics: [
      { id: 't-arr', name: 'Arrays & Linked Lists', difficulty: 45, weightage: 10, mastery: 74, priority: 36, estimatedMin: 50, status: 'On track' },
      { id: 't-trees', name: 'Trees', difficulty: 72, weightage: 18, mastery: 40, priority: 83, estimatedMin: 110, status: 'High Priority' },
    ],
  },
  {
    id: 'dsa-u2',
    subjectId: 'dsa',
    name: 'Unit 2 — Graphs & DP',
    topics: [
      { id: 't-graphs', name: 'Graphs', difficulty: 84, weightage: 16, mastery: 34, priority: 79, estimatedMin: 120, status: 'High Priority' },
      { id: 't-dp', name: 'Dynamic Programming', difficulty: 88, weightage: 14, mastery: 28, priority: 76, estimatedMin: 130, status: 'Medium' },
    ],
  },
  {
    id: 'se-u1',
    subjectId: 'se',
    name: 'Unit 1 — Process & Design',
    topics: [
      { id: 't-sdlc', name: 'SDLC Models', difficulty: 35, weightage: 12, mastery: 92, priority: 18, estimatedMin: 30, status: 'On track' },
      { id: 't-uml', name: 'UML & Architecture', difficulty: 50, weightage: 14, mastery: 86, priority: 22, estimatedMin: 40, status: 'On track' },
    ],
  },
  {
    id: 'se-u2',
    subjectId: 'se',
    name: 'Unit 2 — Quality',
    topics: [
      { id: 't-test', name: 'Testing strategies', difficulty: 55, weightage: 16, mastery: 71, priority: 38, estimatedMin: 50, status: 'On track' },
    ],
  },
]

export const nowStudy = {
  subjectId: 'dbms',
  subject: 'DBMS',
  topic: 'Normalization',
  topicId: 't-norm',
  priorityScore: 94,
  estimatedLabel: '2h 15m',
  estimatedMin: 135,
  reasons: [
    'Exam in 4 days',
    '20% marks weightage',
    'Frequently asked',
    'High difficulty',
    'Your current mastery is only 35%',
  ],
}

export function allTopics() {
  return units.flatMap((unit) =>
    unit.topics.map((topic) => ({ ...topic, unitId: unit.id, subjectId: unit.subjectId, unitName: unit.name })),
  )
}
