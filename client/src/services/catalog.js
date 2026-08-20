import { student } from '../data/student'
import { subjects } from '../data/subjects'
import { exams } from '../data/exams'
import { units, nowStudy, allTopics } from '../data/topics'
import { initialSchedule, replannedSchedule, weekPlan } from '../data/studySchedule'
import { progressSummary, weakTopics, strongTopics, activity, risks } from '../data/progress'
import { masteryTrend, studyHours, predictedReadiness } from '../data/analytics'
import { papers, paperInsights } from '../data/questionPapers'
import { insights } from '../data/insights'

/** Local catalog — swap these functions for REST later. */

export function getStudent() {
  return student
}

export function getSubjects() {
  return subjects
}

export function getExams() {
  return exams
}

export function getUnits(subjectId) {
  if (!subjectId) return units
  return units.filter((unit) => unit.subjectId === subjectId)
}

export function getNowStudy() {
  return nowStudy
}

export function getTopics() {
  return allTopics()
}

export function getSchedule(replanned = false) {
  return replanned ? replannedSchedule : initialSchedule
}

export function getWeekPlan() {
  return weekPlan
}

export function getProgress() {
  return { ...progressSummary, weakTopics, strongTopics, activity, risks }
}

export function getAnalytics() {
  return { masteryTrend, studyHours, predictedReadiness }
}

export function getPapers() {
  return { papers, paperInsights }
}

export function getInsights() {
  return insights
}
