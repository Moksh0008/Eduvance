export const quizBank = {
  subject: 'DBMS',
  unit: 'Unit 3 — Normalization',
  topic: 'Normalization',
  count: 10,
  difficulty: 'Medium',
  minutes: 15,
  questions: [
    {
      id: 'q1',
      prompt: 'A relation is in 1NF if:',
      options: [
        'It has no repeating groups and atomic attributes',
        'Every determinant is a candidate key',
        'It has no transitive dependencies',
        'It is decomposed losslessly',
      ],
      answer: 0,
    },
    {
      id: 'q2',
      prompt: '2NF primarily removes:',
      options: ['Partial dependency on a composite key', 'Transitive dependency', 'Multivalued dependency', 'Join dependency'],
      answer: 0,
    },
    {
      id: 'q3',
      prompt: 'A → B and B → C together imply a risk of:',
      options: ['Transitive dependency A → C', 'Partial dependency only', 'Lossy join always', 'No anomaly'],
      answer: 0,
    },
    {
      id: 'q4',
      prompt: 'Lossless decomposition is guaranteed by the chase test when:',
      options: [
        'The common attributes form a superkey of at least one relation',
        'Both relations have the same number of tuples',
        'All FDs are trivial',
        'The schema is already in 1NF',
      ],
      answer: 0,
    },
    {
      id: 'q5',
      prompt: 'BCNF is stricter than 3NF because:',
      options: [
        'Every determinant must be a candidate key',
        'It allows transitive FDs on non-primes',
        'It ignores multivalued FDs',
        'It only applies to binary relations',
      ],
      answer: 0,
    },
    {
      id: 'q6',
      prompt: 'Dependency preservation means:',
      options: [
        'FDs can be checked without joining all decomposed relations',
        'No tuple is ever lost',
        'All keys remain composite',
        'The relation stays in 1NF only',
      ],
      answer: 0,
    },
    {
      id: 'q7',
      prompt: 'Which form addresses multivalued dependencies?',
      options: ['4NF', '2NF', 'BCNF', '1NF'],
      answer: 0,
    },
    {
      id: 'q8',
      prompt: 'A prime attribute is:',
      options: ['An attribute that is part of some candidate key', 'Any foreign key', 'A derived attribute', 'A null-able column'],
      answer: 0,
    },
    {
      id: 'q9',
      prompt: 'Update anomalies typically appear when:',
      options: ['The same fact is stored in multiple tuples', 'The schema is in BCNF', 'All FDs are preserved', 'Decomposition is lossless'],
      answer: 0,
    },
    {
      id: 'q10',
      prompt: 'Canonical cover of FDs is useful because it:',
      options: ['Removes redundant FDs while preserving equivalence', 'Converts 1NF to 5NF', 'Guarantees a unique key', 'Eliminates all joins'],
      answer: 0,
    },
  ],
}

export const quizResultTemplate = {
  score: 82,
  correct: 8,
  total: 10,
  concept: 82,
  speed: 71,
  accuracy: 80,
  confidence: 60,
  strong: ['Functional Dependencies', 'Normal Forms'],
  weak: ['Lossless Decomposition', 'Dependency Preservation'],
  recommendation:
    'You understand the fundamentals but need additional practice with decomposition problems.',
}
