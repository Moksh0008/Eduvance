export const planDelta = {
  reason: 'Your plan changed because your DBMS mastery is lower than expected.',
  original: [
    { subject: 'DBMS', hours: 2, label: '2h' },
    { subject: 'Java', hours: 2, label: '2h' },
    { subject: 'DSA', hours: 1, label: '1h' },
  ],
  current: [
    { subject: 'DBMS', hours: 2.5, label: '2h 30m' },
    { subject: 'Java', hours: 1.5, label: '1h 30m' },
    { subject: 'DSA', hours: 1, label: '1h' },
  ],
}

export const monitorRisks = [
  {
    id: 'high-dsa',
    level: 'high',
    label: 'High risk',
    title: 'DBMS exam is in 4 days.',
    body: 'Only 48% of high-priority topics are completed. Normalization and B+ Trees are still below 40% mastery.',
    cta: 'Replan',
    to: '/planner',
  },
  {
    id: 'java-u4',
    level: 'attention',
    label: 'Attention',
    title: 'Java concurrency has high weightage but low mastery.',
    body: 'Collections and Multithreading together carry 30% of the paper. Current mastery is 38–44%.',
    cta: 'Study now',
    to: '/study-session',
  },
]
