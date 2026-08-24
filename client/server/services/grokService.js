/* ═══════════════════════════════════════════════════
   AI SERVICE — Server-side AI integration
   xAI Grok (primary) → Groq (fallback)
   All AI calls happen here, never exposed to frontend
   ═══════════════════════════════════════════════════ */

// AI provider configuration
// xAI is primary (configured via XAI_API_KEY + XAI_MODEL)
// Groq is fallback (configured via GROQ_API_KEY + GROQ_MODEL)
const XAI_MODEL = (process.env.XAI_MODEL && !process.env.XAI_MODEL.includes('beta')) ? process.env.XAI_MODEL : 'grok-4.6'
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b'

const PROVIDERS = [
  {
    name: 'xAI',
    baseUrl: 'https://api.x.ai/v1',
    getKey: () => process.env.XAI_API_KEY,
    models: [XAI_MODEL],
  },
  {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    getKey: () => process.env.GROQ_API_KEY,
    models: [GROQ_MODEL],
  },
]

console.log(`[AI] xAI model: ${XAI_MODEL}, Groq model: ${GROQ_MODEL}`)

function getAvailableProviders() {
  return PROVIDERS.filter(p => p.getKey())
}

/**
 * Call AI API with a prompt and optional system instruction
 * Tries xAI first, falls back to Groq
 */
export async function callGrok(systemPrompt, userPrompt, options = {}) {
  const { temperature = 0.7, maxTokens = 4096, timeoutMs = 60000 } = options
  const providers = getAvailableProviders()
  if (providers.length === 0) {
    throw new Error('No AI provider configured. Add XAI_API_KEY or GROQ_API_KEY to Render environment variables.')
  }

  let lastError = null

  // Try ALL providers in order (xAI first, then Groq)
  for (const provider of providers) {
    const models = provider.models || [provider.model]

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
          console.warn(`[AI] Rate limited on ${provider.name}/${model}. Waiting 70s...`)
          await new Promise(r => setTimeout(r, 70000))
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
          console.warn(`[AI] ${provider.name} model ${model} unavailable (${response.status})`)
          lastError = new Error(`${provider.name} model ${model} unavailable`)
          continue // Try next model in this provider
        }

        if (!response.ok) {
          const errText = await response.text()
          console.error(`[AI] ${provider.name} error (${response.status}):`, errText.slice(0, 200))
          lastError = new Error(`${provider.name} API error (${response.status})`)
          continue // Try next model/provider
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content || ''
        if (!content) {
          console.warn(`[AI] ${provider.name}/${model} returned empty content`)
          lastError = new Error('Empty response from AI')
          continue
        }
        console.log(`[AI] ${provider.name}/${model} responded: ${content.length} chars`)
        return content
      } catch (err) {
        clearTimeout(timer)
        if (err.name === 'AbortError') {
          console.warn(`[AI] ${provider.name}/${model} timed out — trying next`)
          lastError = new Error(`${provider.name} timed out`)
          continue
        }
        // Network errors — try next provider
        console.warn(`[AI] ${provider.name}/${model} network error: ${err.message}`)
        lastError = err
        break // Break model loop, try next provider
      }
    }
    // If we got here, all models for this provider failed — try next provider
  }

  throw new Error(`All AI providers failed. Last error: ${lastError?.message || 'unknown'}. Check server logs for details.`)
}

/**
 * Extract and parse JSON from AI response
 * Handles: markdown fences, truncated responses, mixed text+JSON
 */
function extractJSON(raw) {
  let jsonStr = raw

  // Step 1: Strip markdown code fences
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

    // Remove trailing incomplete values
    // Remove trailing comma
    fixed = fixed.replace(/,\s*$/, '')

    // If we're mid-string (odd number of unescaped quotes), close the string
    const quoteCount = (fixed.match(/(?<!\\)"/g) || []).length
    if (quoteCount % 2 !== 0) {
      // Odd quotes = unclosed string. Close it and remove incomplete value
      // Find last key-value pair boundary
      fixed = fixed.replace(/:\s*"[^"]*$/, ': ""')
      // Or if we're mid-key
      fixed = fixed.replace(/,\s*"[^"]*$/, '')
      fixed = fixed.replace(/\{\s*"[^"]*$/, '{')
    }

    // Remove trailing incomplete key-value pairs
    fixed = fixed.replace(/,\s*"[^"]*\s*:\s*$/, '')
    fixed = fixed.replace(/"[^"]*\s*:\s*$/, '')

    // Cut at last complete object boundary (last })
    const lastBrace = fixed.lastIndexOf('}')
    if (lastBrace > 0) {
      fixed = fixed.slice(0, lastBrace + 1)
    }

    // Close any unclosed brackets
    const openSquare = (fixed.match(/\[/g) || []).length - (fixed.match(/\]/g) || []).length
    const openCurly = (fixed.match(/\{/g) || []).length - (fixed.match(/\}/g) || []).length
    fixed += '}'.repeat(Math.max(0, openCurly)) + ']'.repeat(Math.max(0, openSquare))

    const parsed = JSON.parse(fixed)
    console.warn(`[AI] Repaired truncated JSON — recovered ${Array.isArray(parsed) ? parsed.length : 1} items`)
    return parsed
  } catch (repairErr) {
    console.error('[AI] JSON repair failed:', repairErr.message)
  }

  // Step 5: Last resort — try to extract individual question objects
  try {
    const objects = []
    const objRegex = /\{[^{}]*?"prompt"\s*:\s*"[^"]*"[^{}]*?"options"\s*:\s*\[[^\[\]]*\][^{}]*?"correctAnswer"\s*:\s*\d[^{}]*\}/g
    let match
    while ((match = objRegex.exec(jsonStr)) !== null) {
      try {
        const obj = JSON.parse(match[0])
        if (obj.prompt && Array.isArray(obj.options) && obj.options.length === 4) {
          objects.push(obj)
        }
      } catch {}
    }
    if (objects.length > 0) {
      console.warn(`[AI] Extracted ${objects.length} individual question objects from truncated response`)
      return objects
    }
  } catch {}

  throw new Error(`Could not parse AI response as JSON`)
}

/**
 * Validate a single quiz question
 */
function validateQuestion(q) {
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
      'Return ONLY a valid JSON array in English. No text before or after. No markdown fences. All content must be in English.',
      userPrompt,
      { ...options, temperature: 0.1, maxTokens: options.maxTokens || 4096 }
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
  const seen = new Set()
  for (let i = 0; i < parsed.length; i++) {
    const q = validateQuestion(parsed[i])
    if (q && !seen.has(q.prompt.toLowerCase().slice(0, 50))) {
      seen.add(q.prompt.toLowerCase().slice(0, 50))
      valid.push(q)
    }
  }

  if (valid.length === 0) {
    throw new Error('AI returned no valid questions')
  }

  console.log(`[AI] Validated ${valid.length}/${parsed.length} questions`)
  return valid
}

/**
 * Generate quiz questions — BATCHED to prevent truncation
 * Generates questions in small batches of 3-5 to stay within token limits
 */
export async function generateQuizQuestions({ subject, topic, difficulty, count, context, previousQuestions = [] }) {
  const BATCH_SIZE = 3
  const allQuestions = []
  const seenPrompts = new Set()
  let attempts = 0
  const maxAttempts = Math.ceil(count / BATCH_SIZE) + 2

  while (allQuestions.length < count && attempts < maxAttempts) {
    attempts++
    const remaining = count - allQuestions.length
    const batchSize = Math.min(BATCH_SIZE, remaining)

    const systemPrompt = `Generate ${batchSize} MCQ questions about ${topic} (${subject}). Difficulty: ${difficulty}.

CRITICAL: All questions, options, and explanations MUST be written in English. Do NOT use any other language.

Return ONLY a JSON array. Each object:
{"prompt":"question?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"why"}`

    const prevSlice = allQuestions.slice(-3).map(q => q.prompt.slice(0, 40)).join('; ')
    const userPrompt = context
      ? `Study material:\n${context.slice(0, 1500)}\n\nGenerate ${batchSize} questions about "${topic}".${prevSlice ? ` Avoid: ${prevSlice}` : ''}`
      : `Generate ${batchSize} ${difficulty} MCQ questions about "${topic}" in ${subject}.${prevSlice ? ` Avoid: ${prevSlice}` : ''}`

    try {
      const batch = await generateAndValidateQuestions(systemPrompt, userPrompt, {
        temperature: 0.4,
        maxTokens: 3000,
      })

      for (const q of batch) {
        const key = q.prompt.toLowerCase().slice(0, 50)
        if (!seenPrompts.has(key)) {
          seenPrompts.add(key)
          allQuestions.push(q)
        }
      }
    } catch (err) {
      console.error(`[QuizBatch] Batch ${attempts} failed:`, err.message)
      if (attempts > 1) break // Don't keep retrying forever
    }

    // Small delay between batches
    if (allQuestions.length < count && attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  if (allQuestions.length === 0) {
    throw new Error('Failed to generate any valid questions')
  }

  console.log(`[QuizBatch] Generated ${allQuestions.length} questions in ${attempts} batches`)
  return allQuestions
}

/**
 * Analyze syllabus text and extract structured topics
 */
export async function analyzeSyllabus(syllabusText) {
  const systemPrompt = `Extract topics from syllabus text. All output MUST be in English.
Return JSON:
{"subjects":[{"name":"...","units":[{"name":"...","topics":[{"name":"...","difficulty":"easy|medium|hard","importance":"high|medium|low"}]}]}]}
Return ONLY valid JSON.`

  return callGrokJSON(systemPrompt, `Syllabus:\n${syllabusText}`, { maxTokens: 3000 })
}

/**
 * Analyze study material and extract knowledge chunks
 */
export async function analyzeStudyMaterial(text, subject = '') {
  const systemPrompt = `Analyze study material. All output MUST be in English.
Return JSON:
{"subject":"...","topics":[{"name":"...","difficulty":"...","keyConcepts":["..."],"chunks":[{"title":"...","content":"...","concepts":["..."]}]}]}
Return ONLY valid JSON.`

  return callGrokJSON(systemPrompt, `Subject: ${subject || 'auto-detect'}\n\nMaterial:\n${text}`, { maxTokens: 3000 })
}

/**
 * Generate question explanation
 */
export async function explainQuestion(question, correctAnswer, selectedAnswer, topic) {
  const systemPrompt = `Explain why the correct answer is right. Be concise (under 100 words). All output MUST be in English.`
  const userPrompt = `Q: ${question}\nCorrect: ${correctAnswer}\nStudent chose: ${selectedAnswer}\nTopic: ${topic}`
  return callGrok(systemPrompt, userPrompt, { maxTokens: 500 })
}

/**
 * Generate AI insights from student performance data
 */
export async function generateInsights(studentData) {
  const systemPrompt = `Analyze student performance. All output MUST be in English.
Return JSON array:
[{"type":"strength|weakness|improvement|action","text":"insight","emoji":"📊","priority":"low|medium|high","subject":"...","topic":"..."}]
Generate 3-6 insights. Return ONLY valid JSON.`
  return callGrokJSON(systemPrompt, `Performance:\n${JSON.stringify(studentData, null, 2)}`, { maxTokens: 2000 })
}

/**
 * Generate adaptive study recommendations
 */
export async function generateRecommendations(studentContext) {
  const systemPrompt = `Recommend what to study next. All output MUST be in English.
Return JSON:
{"primaryRecommendation":{"subject":"...","topic":"...","reason":"...","estimatedMinutes":45},"secondaryRecommendations":[...],"octoMessage":"..."}
Return ONLY valid JSON.`
  return callGrokJSON(systemPrompt, `Context:\n${JSON.stringify(studentContext, null, 2)}`, { maxTokens: 2000 })
}

/**
 * Replan study schedule based on new quiz results
 */
export async function replanSchedule(currentPlan, quizResult, studentContext) {
  const systemPrompt = `Adjust study schedule after quiz. All output MUST be in English.
Return JSON:
{"reason":"...","changes":[{"subject":"...","topic":"...","oldMinutes":30,"newMinutes":50,"reason":"..."}],"octoMessage":"..."}
Return ONLY valid JSON.`
  return callGrokJSON(systemPrompt, `Plan:\n${JSON.stringify(currentPlan, null, 2)}\nQuiz:\n${JSON.stringify(quizResult, null, 2)}`, { maxTokens: 2000 })
}

/**
 * Generate Octo's contextual message
 */
export async function generateOctoMessage(context) {
  const systemPrompt = `You are Octo, a study companion. Generate a brief encouraging message (1-2 sentences, 0-1 emojis) in English. Return ONLY the message text.`
  return callGrok(systemPrompt, `Context: ${JSON.stringify(context)}`, { maxTokens: 150, temperature: 0.8 })
}
