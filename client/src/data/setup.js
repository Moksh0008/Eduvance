export const optimizationGoals = [
  { id: 'plan', label: 'Complete Study Plan' },
  { id: 'priority', label: 'Topic Prioritization' },
  { id: 'schedule', label: 'Daily Study Schedule' },
  { id: 'quizzes', label: 'Topic-wise Quizzes' },
  { id: 'revision', label: 'Revision Planning' },
  { id: 'weak', label: 'Weak Topic Detection' },
  { id: 'readiness', label: 'Exam Readiness Analysis' },
]

export const syllabusOverview = [
  { id: 'dbms', name: 'DBMS', units: 5, topics: 42 },
  { id: 'java', name: 'Java', units: 6, topics: 51 },
  { id: 'dsa', name: 'DSA', units: 5, topics: 38 },
  { id: 'se', name: 'SE', units: 4, topics: 37 },
]

export const timetableParseStages = [
  'Reading your timetable…',
  'Identifying examination dates…',
  'Building your academic timeline…',
]

export const syllabusParseStages = [
  'Reading syllabus…',
  'Identifying subjects…',
  'Extracting units…',
  'Extracting topics…',
  'Building knowledge map…',
]

export const analysisStages = [
  { id: 'tt', label: 'Exam timetable analyzed' },
  { id: 'sub', label: '4 subjects identified' },
  { id: 'units', label: '21 units detected' },
  { id: 'topics', label: '168 topics identified' },
  { id: 'diff', label: 'Topic difficulty calculated' },
  { id: 'urg', label: 'Exam urgency calculated' },
  { id: 'pri', label: 'Study priorities generated' },
]

export const analysisPipeline = [
  'TIMETABLE',
  'SYLLABUS',
  'TOPIC ANALYSIS',
  'DIFFICULTY',
  'WEIGHTAGE',
  'PRIORITY',
  'TIME OPTIMIZATION',
  'STUDY STRATEGY',
]
