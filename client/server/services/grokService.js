/* ═══════════════════════════════════════════════════
   AI SERVICE — Server-side AI integration
   Supports xAI Grok and Groq (fallback)
   All AI calls happen here, never exposed to frontend
   ═══════════════════════════════════════════════════ */

// Provider priority: Groq → xAI (fallback)
// Model list: tried in order until one works (handles deprecations gracefully)
const GROQ_MODELS = [
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile',
  'llama3-70b-8192',
  'llama3-8b-8192',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'qwen/qwen3.6-27b',
]

const PROVIDERS = [
  {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    getKey: () => process.env.GROQ_API_KEY,
    models: GROQ_MODELS,
    model: process.env.GROQ_MODEL || GROQ_MODELS[0],
  },
  {
    name: 'xAI',
    baseUrl: 'https://api.x.ai/v1',
    getKey: () => process.env.XAI_API_KEY,
    models: ['grok-2-1212', 'grok-beta'],
    model: 'grok-2-1212',
  },
]

function getActiveProvider() {
  for (const p of PROVIDERS) {
    if (p.getKey()) return p
  }
  throw new Error('No AI provider configured. Add GROQ_API_KEY or XAI_API_KEY to server/.env')
}

/**
 * Call AI API with a prompt and optional system instruction
 * Tries Groq first (free), falls back to xAI
 * @param {string} systemPrompt - System context/instruction
 * @param {string} userPrompt - User message
 * @param {object} options - Additional options
 * @returns {string} Raw text response
 */
export async function callGrok(systemPrompt, userPrompt, options = {}) {
  const { temperature = 0.7, maxTokens = 2500, timeoutMs = 60000 } = options
  const provider = getActiveProvider()
  const models = provider.models || [provider.model]
  let lastError = null

  // Try each model until one works
  for (const model of models) {
    console.log(`[Grok] Trying ${provider.name} (${model})...`)
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

      if (response.status === 429) {
        // Rate limit — TPM resets after ~60s, so wait that long
        const errBody = await response.json().catch(() => ({}))
        const retryAfter = errBody.error?.message?.match(/try again in ([\d.]+)s/)?.[1]
        // Wait 65 seconds to ensure TPM window fully resets
        const waitMs = 65000
        console.warn(`[Grok] Rate limited on ${model}. Waiting 65s for TPM window reset...`)
        clearTimeout(timer)
        await new Promise(r => setTimeout(r, waitMs))
        // Retry the same model
        try {
          const retryController = new AbortController()
          const retryTimer = setTimeout(() => retryController.abort(), timeoutMs)
          const retryRes = await fetch(`${provider.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${provider.getKey()}` },
            body: JSON.stringify({ model, messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ], temperature, max_tokens: maxTokens }),
            signal: retryController.signal,
          })
          clearTimeout(retryTimer)
          if (retryRes.ok) {
            const data = await retryRes.json()
            const content = data.choices?.[0]?.message?.content || ''
            console.log(`[Grok] Retry succeeded with ${model}: ${content.length} chars`)
            return content
          }
        } catch {}
        continue // try next model
      }

      if (response.status === 404 || response.status === 400) {
        const errText = await response.text()
        console.warn(`[Grok] ${provider.name} model ${model} unavailable (${response.status}):`, errText.slice(0, 100))
        lastError = new Error(`Model ${model} unavailable`)
        continue // try next model
      }

      if (!response.ok) {
        const errText = await response.text()
        console.error(`[${provider.name}] API error:`, response.status, errText)
        throw new Error(`${provider.name} API error (${response.status}): ${errText}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || ''
      console.log(`[Grok] ${provider.name} responded with ${model}: ${content.length} chars`)
      return content
    } catch (err) {
      clearTimeout(timer)
      if (err.name === 'AbortError') {
        console.warn(`[Grok] ${provider.name} model ${model} timed out after ${timeoutMs}ms — trying next`)
        lastError = new Error(`${provider.name} timed out`)
        continue
      }
      throw err
    }
  }

  throw new Error(`All ${provider.name} models failed. Last error: ${lastError?.message || 'unknown'}`)
}

/**
 * Call Grok and parse response as JSON
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {object} options
 * @returns {object} Parsed JSON from Grok response
 */
export async function callGrokJSON(systemPrompt, userPrompt, options = {}) {
  const raw = await callGrok(systemPrompt, userPrompt, {
    ...options,
    temperature: 0.3,
  })

  // Extract JSON from response (may be wrapped in markdown code blocks)
  let jsonStr = raw
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonMatch) {
    jsonStr = jsonMatch[1]
  }

  // Try to find JSON object or array in the response
  const objMatch = jsonStr.match(/(\{[\s\S]*\})/)
  const arrMatch = jsonStr.match(/(\[[\s\S]*\])/)

  if (objMatch) jsonStr = objMatch[1]
  else if (arrMatch) jsonStr = arrMatch[1]

  try {
    return JSON.parse(jsonStr)
  } catch {
    // Repair truncated JSON (response hit max_tokens)
    try {
      let fixed = jsonStr
      // Remove trailing incomplete string
      fixed = fixed.replace(/"[^"\n]*$/, '"')
      // Remove trailing comma
      fixed = fixed.replace(/,\s*$/, '')
      // Close any open objects/arrays by finding last complete item
      const lastClose = Math.max(fixed.lastIndexOf('}'), fixed.lastIndexOf(']'))
      if (lastClose > 0) fixed = fixed.slice(0, lastClose + 1)
      // Try closing remaining brackets
      const opens = (fixed.match(/\[/g) || []).length - (fixed.match(/\]/g) || []).length
      const curlyOpens = (fixed.match(/\{/g) || []).length - (fixed.match(/\}/g) || []).length
      fixed += ']'.repeat(Math.max(0, opens)) + '}'.repeat(Math.max(0, curlyOpens))
      const parsed = JSON.parse(fixed)
      console.warn(`[Grok] Repaired truncated JSON — got ${Array.isArray(parsed) ? parsed.length : 1} items`)
      return parsed
    } catch {
      throw new Error(`Failed to parse Grok response as JSON: ${raw.slice(0, 300)}`)
    }
  }
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
  const systemPrompt = `You are an expert exam question generator for Computer Science topics.

Generate EXACTLY ${count} multiple-choice questions about ${subject} → ${topic} at ${difficulty} difficulty level.

Return a JSON array with this EXACT structure:
[
  {
    "prompt": "question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this answer is correct...",
    "difficulty": "${difficulty}",
    "sourceContext": "which part of the material this question is based on"
  }
]

Rules:
- Questions must be specific to ${topic}, not generic
- Include a mix of conceptual, application, and scenario-based questions
- Each question must have exactly 4 options
- correctAnswer is the 0-based index of the correct option
- Questions should be exam-level difficulty
- Do NOT generate questions already asked: ${previousQuestions.length > 0 ? previousQuestions.slice(-5).join('; ') : 'none'}
- If study material context is provided, base questions on that material
- Return ONLY valid JSON array, no explanations`

  const userPrompt = context
    ? `Generate ${count} ${difficulty} questions about ${topic}.\n\nRelevant study material:\n${context}`
    : `Generate ${count} ${difficulty} questions about ${topic} in ${subject}.`

  return callGrokJSON(systemPrompt, userPrompt)
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
// force redeploy 1787491781
