# Eduvance — client

Adaptive Examination Preparation & Study Optimization System.

Phase 1 is **frontend only**. Sample data lives in `src/data` and is accessed through `src/services/catalog.js`.

## Run

```bash
cd client
npm install
npm run dev
```

## Routes

| Path | Page |
|---|---|
| `/` | Landing |
| `/login` `/register` | Auth UI |
| `/dashboard` | Command center |
| `/planner` | Adaptive day plan |
| `/syllabus` | Topic explorer |
| `/progress` | Readiness |
| `/setup` | Onboarding |
| `/subjects` `/timetable` `/analytics` `/question-papers` `/study-session` `/profile` | Product surfaces |
