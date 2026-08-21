/** Simulated processing delays. Replace with REST later (e.g. POST /api/timetable/parse). */

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function runStages(stages, onStage, ms = 720) {
  for (let i = 0; i < stages.length; i += 1) {
    onStage(i, stages[i], 'active')
    await wait(ms)
    onStage(i, stages[i], 'done')
  }
}
