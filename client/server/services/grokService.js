/* ═══════════════════════════════════════════════════
   AI SERVICE — Server-side AI integration
   xAI Grok (primary) → Groq (fallback)
   All AI calls happen here, never exposed to frontend
   ═══════════════════════════════════════════════════ */

// Provider priority: xAI (primary) → Groq (fallback)
const PROVIDERS = [
  {
    name: 'xAI',
    baseUrl: 'https://api.x.ai/v1',
    getKey: () => process.env.XAI_API_KEY,
    models: ['grok-2-1212', 'grok-beta'],
    model: 'grok-2-1212',
  },
  {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    getKey: () => process.env.GROQ_API_KEY,
    models: [
      'llama-3.1-8b-instant',
      'llama-3.3-70b-versatile',
      'llama3-70b-8192',
      'llama3-8b-8192',
      'mixtral-8x7b-32768',
      'gemma2-9b-it',
      'openai/gpt-oss-20b',
      'openai/gpt-oss-120b',
      'qwen/qwen3.6-27b',
    ],
    model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
  },
]

function getActiveProvider() {
  for (const p of PROVIDERS) {
    if (p.getKey()) return p
  }
  throw new Error('No AI provider configured. Add XAI_API_KEY to Render environment variables.')
}

/**
 * Call AI API with a prompt and optional system instruction
 * Tries xAI first, falls back to Groq
 */
export async function callGrok(systemPrompt, userPrompt, options = {}) {
  const { temperature = 0.7, maxTokens = 2500, timeoutMs = 60000 } = options
  const provider = getActiveProvider()
  const models = provider.models || [provider.model]
  let lastError = null

  for (const model of models) {
    console.log(`[AI] Trying ${provider.name} (${model})...`)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.getKey()}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature,
          max_tokens: maxTokens,
        }),
        signal: controller.signal,
      })
      clearTimeout(timer)

      // Rate limit — wait and retry
      if (response.status === 429) {
        console.warn(`[AI] Rate limited on ${provider.name}/${model}. Waiting 65s...`)
        await new Promise(r => setTimeout(r, 65000))
        try {
          const rc = new AbortController()
          const rt = setTimeout(() => rc.abort(), timeoutMs)
          const rr = await fetch(`${provider.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${provider.getKey()}` },
            body: JSON.stringify({ model, messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ], temperature, max_tokens: maxTokens }),
            signal: rc.signal,
          })
          clearTimeout(rt)
          if (rr.ok) {
            const data = await rr.json()
            const content = data.choices?.[0]?.message?.content || ''
            console.log(`[AI] Retry succeeded with ${model}: ${content.length} chars`)
            return content
          }
        } catch {}
        continue
      }

      if (response.status === 404 || response.status === 400) {
        const errText = await response.text()
        console.warn(`[AI] ${provider.name} model ${model} unavailable (${response.status})`)
        lastError = new Error(`Model ${model} unavailable`)
        continue
      }

      if (!response.ok) {
        const errText = await response.text()
        console.error(`[AI] ${provider.name} error (${response.status}):`, errText.slice(0, 200))
        throw new Error(`${provider.name} API error (${response.status})`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || ''
      console.log(`[AI] ${provider.name}/${model} responded: ${content.length} chars`)
      return content
    } catch (err) {
      clearTimeout(timer)
      if (err.name === 'AbortError') {
        console.warn(`[AI] ${provider.name}/${model} timed out — trying next`)
        lastError = new Error(`${provider.name} timed out`)
        continue
      }
      throw err
    }
  }

  throw new Error(`All ${provider.name} models failed. Last error: ${lastError?.message || 'unknown'}. Server logs may have details.`)
}

/**
 * Extract and parse JSON from AI response
 * Handles: markdown fences, truncated responses, mixed text+JSON
 */
function extractJSON(raw) {
  let jsonStr = raw

  // Step 1: Strip markdown code fences
  // Try matching ```json ... ``` (with closing fences)
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim()
  } else {
    // No closing fences (truncated) — strip opening fence
    jsonStr = raw.replace(/^```(?:json)?\s*/m, '').trim()
  }

  // Step 2: Find the start of JSON array or object
  const arrIdx = jsonStr.indexOf('[')
  const objIdx = jsonStr.indexOf('{')
  if (arrIdx >= 0 && (objIdx < 0 || arrIdx < objIdx)) {
    jsonStr = jsonStr.slice(arrIdx)
  } else if (objIdx >= 0) {
    jsonStr = jsonStr.slice(objIdx)
  }

  // Step 3: Try parsing as-is
  try {
    return JSON.parse(jsonStr)
  } catch {}

  // Step 4: Repair truncated JSON
  try {
    let fixed = jsonStr
    // Cut at last complete object boundary
    const lastBrace = fixed.lastIndexOf('}')
    if (lastBrace > 0) {
      fixed = fixed.slice(0, lastBrace + 1)
    } else {
      // No complete object — try to salvage partial
      fixed = fixed.replace(/,[\s]*$/, '').replace(/"[^"]*$/, '"')
    }
    // Close any unclosed brackets
    const openSquare = (fixed.match(/\[/g) || []).length - (fixed.match(/\]/g) || []).length
    const openCurly = (fixed.match(/\{/g) || []).length - (fixed.match(/\}/g) || []).length
    fixed += ']'.repeat(Math.max(0, openSquare)) + '}'.repeat(Math.max(0, openCurly))

    const parsed = JSON.parse(fixed)
    console.warn(`[AI] Repaired truncated JSON — recovered ${Array.isArray(parsed) ? parsed.length : 1} items`)
    return parsed
  } catch {}

  throw new Error(`Could not parse AI response as JSON`)
}

/**
 * Validate a single quiz question
 */
function validateQuestion(q, index) {
  if (!q || typeof q !== 'object') return null
  if (!q.prompt || typeof q.prompt !== 'string') return null
  if (!Array.isArray(q.options) || q.options.length !== 4) return null
  if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) return null
  if (!Number.isInteger(q.correctAnswer)) return null
  return {
    prompt: q.prompt.trim(),
    options: q.options.map(o => String(o).trim()),
    correctAnswer: q.correctAnswer,
    explanation: (q.explanation || 'No explanation provided').trim().slice(0, 200),
  }
}

/**
 * Call AI and parse as JSON, with retry on failure
 */
export async function callGrokJSON(systemPrompt, userPrompt, options = {}) {
  const raw = await callGrok(systemPrompt, userPrompt, {
    ...options,
    temperature: 0.3,
  })

  try {
    return extractJSON(raw)
  } catch (firstErr) {
    console.warn(`[AI] First parse attempt failed, retrying with stricter prompt...`)
    // Retry with even more explicit JSON-only instruction
    const retryRaw = await callGrok(
      systemPrompt + '\n\nIMPORTANT: Return ONLY the JSON array. No text before or after. No markdown fences. No explanation.',
      userPrompt,
      { ...options, temperature: 0.1, maxTokens: options.maxTokens || 2500 }
    )
    return extractJSON(retryRaw)
  }
}

/**
 * Generate and validate quiz questions
 * Returns only valid questions, never raw AI output
 */
export async function generateAndValidateQuestions(systemPrompt, userPrompt, options = {}) {
  let parsed = await callGrokJSON(systemPrompt, userPrompt, options)

  // Normalize: if AI returned an object with a questions array, unwrap it
  if (parsed && !Array.isArray(parsed) && Array.isArray(parsed.questions)) {
    parsed = parsed.questions
  }
  if (parsed && !Array.isArray(parsed) && Array.isArray(parsed.data)) {
    parsed = parsed.data
  }

  if (!Array.isArray(parsed)) {
    throw new Error('AI did not return an array of questions')
  }

  // Validate each question
  const valid = []
  for (let i = 0; i < parsed.length; i++) {
    const q = validateQuestion(parsed[i], i)
    if (q) valid.push(q)
  }

  if (valid.length === 0) {
    throw new Error('AI returned no valid questions')
  }

  console.log(`[AI] Validated ${valid.length}/${parsed.length} questions`)
  return valid
}

/**
 * Analyze syllabus text and extract structured topics
 */
export async function analyzeSyllabus(syllabusText) {
  const systemPrompt = `You are an academic syllabus analyzer. Extract structured topic information from the syllabus text.

Return a JSON object with this EXACT structure:
{
  "subjects": [
    {
      "name": "Subject Name",
      "units": [
        {
          "name": "Unit Name",
          "topics": [
            {
              "name": "Topic Name",
              "difficulty": "easy|medium|hard",
              "importance": "high|medium|low",
              "estimatedMinutes": 60,
              "prerequisites": ["prerequisite topic names"]
            }
          ]
        }
      ]
    }
  ]
}

Rules:
- Extract ALL subjects, units, and topics from the syllabus
- Estimate difficulty based on typical CS curriculum
- Mark important/frequently tested topics as high importance
- Provide realistic study time estimates
- Identify prerequisite relationships where obvious
- Return ONLY valid JSON, no explanations`

  return callGrokJSON(systemPrompt, `Syllabus content:\n\n${syllabusText}`)
}

/**
 * Analyze study material and extract knowledge chunks
 */
export async function analyzeStudyMaterial(text, subject = '') {
  const systemPrompt = `You are a study material analyzer. Break down educational content into structured knowledge chunks.

Return a JSON object with this EXACT structure:
{
  "subject": "detected subject name",
  "topics": [
    {
      "name": "topic name",
      "difficulty": "easy|medium|hard",
      "keyConcepts": ["concept1", "concept2"],
      "chunks": [
        {
          "title": "chunk title",
          "content": "the actual content text",
          "concepts": ["concept1"],
          "potentialQuestions": ["what is X?", "how does Y work?"]
        }
      ]
    }
  ]
}

Rules:
- Extract ALL meaningful educational content
- Break into logical chunks of 100-300 words each
- Identify key concepts and definitions
- Note potential exam questions
- Maintain accuracy — do not add information not in the source
- Return ONLY valid JSON`

  return callGrokJSON(systemPrompt, `Subject: ${subject || 'auto-detect'}\n\nMaterial:\n${text}`)
}

/**
 * Generate quiz questions from retrieved context
 */
export async function generateQuizQuestions({ subject, topic, difficulty, count, context, previousQuestions = [] }) {
  const systemPrompt = `Generate ${count} multiple-choice questions about ${topic} in ${subject} at ${difficulty} difficulty.

Return ONLY a JSON array. No markdown, no explanation text before or after.

Each question object must have exactly these fields:
- "prompt": the question text
- "options": array of exactly 4 strings
- "correctAnswer": integer 0-3
- "explanation": short explanation (under 50 words)

Rules:
- Questions must be specific to ${topic}
- Mix conceptual, application, and scenario-based questions
- Do not repeat these previous questions: ${previousQuestions.slice(0, 3).map(q => q.slice(0, 40)).join('; ') || 'none'}`

  const userPrompt = context
    ? `Based on this study material, generate ${count} ${difficulty} questions about ${topic}:\n\n${context.slice(0, 2000)}`
    : `Generate ${count} ${difficulty} MCQ questions about ${topic} in ${subject}.`

  return generateAndValidateQuestions(systemPrompt, userPrompt, { maxTokens: 2500 })
}

/**
 * Generate question explanation
 */
export async function explainQuestion(question, correctAnswer, selectedAnswer, topic) {
  const systemPrompt = `You are a helpful CS tutor. Explain why the correct answer is right and why the student's answer is wrong (if applicable).

Be concise but thorough. Use examples if helpful. Keep the explanation under 150 words.`

  const userPrompt = `Question: ${question}\nCorrect answer: ${correctAnswer}\nStudent selected: ${selectedAnswer}\nTopic: ${topic}\n\nExplain the correct answer.`

  return callGrok(systemPrompt, userPrompt, { maxTokens: 500 })
}

/**
 * Generate AI insights from student performance data
 */
export async function generateInsights(studentData) {
  const systemPrompt = `You are an AI study advisor. Analyze the student's preparation data and generate actionable insights.

Return a JSON array of insights:
[
  {
    "type": "strength|weakness|improvement|regression|action|consistency|recommendation|alert",
    "text": "insight text",
    "emoji": "relevant emoji",
    "priority": "low|medium|high",
    "subject": "subject name or null",
    "topic": "topic name or null"
  }
]

Rules:
- Generate 3-6 meaningful insights based on the data
- Be specific with numbers and percentages
- Focus on actionable advice
- Never shame the student — always constructive
- Include at least one positive insight if data supports it
- Return ONLY valid JSON array`

  return callGrokJSON(systemPrompt, `Student performance data:\n${JSON.stringify(studentData, null, 2)}`)
}

/**
 * Generate adaptive study recommendations
 */
export async function generateRecommendations(studentContext) {
  const systemPrompt = `You are an adaptive learning AI. Based on the student's current state, recommend what they should study next.

Return a JSON object:
{
  "primaryRecommendation": {
    "subject": "subject",
    "topic": "topic",
    "reason": "why this is recommended",
    "estimatedMinutes": 45,
    "difficulty": "easy|medium|hard"
  },
  "secondaryRecommendations": [
    {
      "subject": "subject",
      "topic": "topic",
      "reason": "reason",
      "estimatedMinutes": 30
    }
  ],
  "octoMessage": "A friendly message from the study companion (2 sentences max)"
}

Rules:
- Primary recommendation should be the highest-priority topic
- Consider exam proximity, weak areas, and recent performance
- Don't recommend topics already mastered (>85% accuracy)
- The octoMessage should be encouraging and specific to this student
- Return ONLY valid JSON`

  return callGrokJSON(systemPrompt, `Student context:\n${JSON.stringify(studentContext, null, 2)}`)
}

/**
 * Replan study schedule based on new quiz results
 */
export async function replanSchedule(currentPlan, quizResult, studentContext) {
  const systemPrompt = `You are a study planner AI. The student just completed a quiz. Adjust their study schedule accordingly.

Return a JSON object:
{
  "reason": "Why the plan changed",
  "changes": [
    {
      "subject": "subject",
      "topic": "topic",
      "oldMinutes": 30,
      "newMinutes": 50,
      "reason": "why this changed"
    }
  ],
  "octoMessage": "A brief message explaining what changed and why (2 sentences max)"
}

Rules:
- If the quiz score was low (<70%), increase time for that topic
- If the quiz score was high (>85%), reduce time and reallocate to weaker areas
- Don't dramatically change the entire plan — make targeted adjustments
- Always explain the reasoning
- The octoMessage should be friendly and specific
- Return ONLY valid JSON`

  return callGrokJSON(systemPrompt, `Current schedule:\n${JSON.stringify(currentPlan, null, 2)}\n\nQuiz result:\n${JSON.stringify(quizResult, null, 2)}\n\nStudent context:\n${JSON.stringify(studentContext, null, 2)}`)
}

/**
 * Generate Octo's contextual message
 */
export async function generateOctoMessage(context) {
  const systemPrompt = `You are Octo, a friendly purple octopus study companion. Generate a brief, encouraging message based on the student's current situation.

Rules:
- Keep it to 1-2 sentences
- Use 0-1 emojis max
- Be specific to what the student is doing
- Never be condescending
- If the student is struggling, be supportive
- If the student is doing well, celebrate briefly
- Return ONLY the message text, no JSON`

  return callGrok(systemPrompt, `Student context: ${JSON.stringify(context)}`, { maxTokens: 150, temperature: 0.8 })
}
