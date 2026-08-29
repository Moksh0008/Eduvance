/* ═══════════════════════════════════════════════════
   AI SERVICE — Provider abstraction layer
   
   Supports configurable primary + fallback AI providers.
   All AI calls happen here, never exposed to frontend.
   
   Environment variables:
     AI_PROVIDER          — primary provider name (xai|groq|openai)
     PRIMARY_AI_MODEL     — model for primary provider
     PRIMARY_AI_API_KEY   — API key for primary provider (or legacy XAI_API_KEY/GROQ_API_KEY)
     FALLBACK_AI_PROVIDER — optional fallback provider name
     FALLBACK_AI_MODEL    — model for fallback provider
     FALLBACK_AI_API_KEY  — API key for fallback provider
     
   Legacy vars (still supported):
     XAI_API_KEY, XAI_MODEL, GROQ_API_KEY, GROQ_MODEL
   ═══════════════════════════════════════════════════ */

// ═══ PROVIDER REGISTRY ═══
// Maps provider names to their API configuration.
// To add a new provider, add an entry here.

const PROVIDER_REGISTRY = {
  xai: {
    name: 'xAI',
    baseUrl: 'https://api.x.ai/v1',
    defaultModel: 'grok-4.6',
    getKey: (cfg) => cfg.primaryApiKey || process.env.XAI_API_KEY,
    getFallbackKey: (cfg) => cfg.fallbackApiKey || process.env.GROQ_API_KEY,
  },
  groq: {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.1-8b-instant',
    getKey: (cfg) => cfg.primaryApiKey || process.env.GROQ_API_KEY,
    getFallbackKey: (cfg) => cfg.fallbackApiKey || null,
  },
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    getKey: (cfg) => cfg.primaryApiKey || process.env.OPENAI_API_KEY,
    getFallbackKey: (cfg) => cfg.fallbackApiKey || null,
  },
  // Generic OpenAI-compatible provider for any self-hosted or hosted
  // open-source model (Together AI, Hugging Face, Ollama, etc.)
  // Configure via: AI_PROVIDER=openai-compatible
  //               PRIMARY_AI_BASE_URL=https://api.together.xyz/v1
  //               PRIMARY_AI_API_KEY=...
  //               PRIMARY_AI_MODEL=meta-llama/Llama-3-8b-chat-hf
  'openai-compatible': {
    name: 'OpenAI-Compatible',
    baseUrl: process.env.PRIMARY_AI_BASE_URL || 'http://localhost:11434/v1',
    defaultModel: 'llama-3.1-8b-instant',
    getKey: (cfg) => cfg.primaryApiKey || process.env.OPENAI_COMPATIBLE_API_KEY,
    getFallbackKey: (cfg) => cfg.fallbackApiKey || null,
  },
}

// ═══ CONFIGURATION ═══
// Resolve provider config from environment variables.
// Supports both new (AI_PROVIDER) and legacy (XAI_API_KEY) vars.

function resolveConfig() {
  // Determine primary provider
  const primaryName = (process.env.AI_PROVIDER || 'xai').toLowerCase()
  const primaryRegistry = PROVIDER_REGISTRY[primaryName]
  if (!primaryRegistry) {
    console.warn(`[AI] Unknown primary provider "${primaryName}". Falling back to xAI.`)
  }

  const primary = primaryRegistry || PROVIDER_REGISTRY.xai
  const primaryModel = process.env.PRIMARY_AI_MODEL || process.env.XAI_MODEL || primary.defaultModel
  const primaryApiKey = process.env.PRIMARY_AI_API_KEY || process.env.XAI_API_KEY || primary.getKey({})
  const primaryBaseUrl = process.env.PRIMARY_AI_BASE_URL || null

  // Determine fallback provider
  const fallbackName = (process.env.FALLBACK_AI_PROVIDER || '').toLowerCase() || null
  let fallback = null
  let fallbackModel = null
  let fallbackApiKey = null

  if (fallbackName && PROVIDER_REGISTRY[fallbackName]) {
    fallback = PROVIDER_REGISTRY[fallbackName]
    fallbackModel = process.env.FALLBACK_AI_MODEL || process.env.GROQ_MODEL || fallback.defaultModel
    fallbackApiKey = process.env.FALLBACK_AI_API_KEY || process.env.GROQ_API_KEY || fallback.getFallbackKey({})
  }

  // Override baseUrl if PRIMARY_AI_BASE_URL is set (for openai-compatible)
  const resolvedPrimary = primaryBaseUrl
    ? { ...primary, baseUrl: primaryBaseUrl }
    : primary

  return {
    primary: {
      ...resolvedPrimary,
      model: primaryModel,
      apiKey: primaryApiKey,
    },
    fallback: fallback ? {
      ...fallback,
      model: fallbackModel,
      apiKey: fallbackApiKey,
    } : null,
  }
}

const CONFIG = resolveConfig()

// ═══ STARTUP LOGGING ═══

export function logProviderConfig() {
  const p = CONFIG.primary
  const f = CONFIG.fallback

  console.log('════════════════════════════════════════')
  console.log('[AI] Provider Configuration')
  console.log(`  Primary:   ${p.name} / ${p.model} ${p.apiKey ? '✅ configured' : '❌ no API key'}`)
  if (p.name === 'OpenAI-Compatible') {
    console.log(`  Base URL:  ${p.baseUrl}`)
  }
  if (f) {
    console.log(`  Fallback:  ${f.name} / ${f.model} ${f.apiKey ? '✅ configured' : '❌ no API key'}`)
  } else {
    console.log('  Fallback:  none configured')
  }
  console.log('════════════════════════════════════════')

  if (!p.apiKey) {
    console.warn('[AI] ⚠️  No primary API key configured. AI features will not work.')
    console.warn('[AI] Set PRIMARY_AI_API_KEY (or XAI_API_KEY) in Render environment variables.')
  }
}

// ═══ ERROR CLASSIFICATION ═══

const ERROR_TYPES = {
  MODEL_UNAVAILABLE: 'model_unavailable',
  INVALID_API_KEY: 'invalid_api_key',
  RATE_LIMITED: 'rate_limited',
  INSUFFICIENT_CREDITS: 'insufficient_credits',
  TIMEOUT: 'timeout',
  NETWORK_ERROR: 'network_error',
  INVALID_RESPONSE: 'invalid_response',
  UNKNOWN: 'unknown',
}

function classifyError(statusCode, responseBody) {
  if (statusCode === 404 || statusCode === 400) return ERROR_TYPES.MODEL_UNAVAILABLE
  if (statusCode === 401 || statusCode === 403) {
    const text = (responseBody || '').toLowerCase()
    if (text.includes('credit') || text.includes('billing') || text.includes('payment')) {
      return ERROR_TYPES.INSUFFICIENT_CREDITS
    }
    return ERROR_TYPES.INVALID_API_KEY
  }
  if (statusCode === 429) return ERROR_TYPES.RATE_LIMITED
  return ERROR_TYPES.UNKNOWN
}

function isRetryable(errorType) {
  return [
    ERROR_TYPES.RATE_LIMITED,
    ERROR_TYPES.TIMEOUT,
    ERROR_TYPES.NETWORK_ERROR,
  ].includes(errorType)
}

function isFallbackEligible(errorType) {
  // These errors mean the provider itself is broken — fall back
  return [
    ERROR_TYPES.MODEL_UNAVAILABLE,
    ERROR_TYPES.INVALID_API_KEY,
    ERROR_TYPES.INSUFFICIENT_CREDITS,
    ERROR_TYPES.TIMEOUT,
    ERROR_TYPES.NETWORK_ERROR,
  ].includes(errorType)
}

// ═══ PROVIDER CALL ═══

/**
 * Call a single AI provider with a prompt.
 * Returns { content, error, errorType }
 */
async function callProvider(provider, model, systemPrompt, userPrompt, options = {}) {
  const { temperature = 0.7, maxTokens = 4096, timeoutMs = 60000 } = options
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
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

    // Handle HTTP errors
    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      const errorType = classifyError(response.status, errText)

      // Log based on error type (never log API keys)
      switch (errorType) {
        case ERROR_TYPES.MODEL_UNAVAILABLE:
          console.warn(`[AI] ${provider.name}/${model} model unavailable (${response.status})`)
          break
        case ERROR_TYPES.INVALID_API_KEY:
          console.warn(`[AI] ${provider.name} invalid or unauthorized API key (${response.status})`)
          break
        case ERROR_TYPES.INSUFFICIENT_CREDITS:
          console.warn(`[AI] ${provider.name} insufficient credits/billing issue (${response.status})`)
          break
        case ERROR_TYPES.RATE_LIMITED:
          console.warn(`[AI] ${provider.name} rate limited (${response.status})`)
          break
        default:
          console.error(`[AI] ${provider.name} error (${response.status}):`, errText.slice(0, 200))
      }

      return { content: null, error: `${provider.name} error (${response.status})`, errorType }
    }

    // Parse successful response
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    if (!content) {
      return { content: null, error: `${provider.name} returned empty content`, errorType: ERROR_TYPES.INVALID_RESPONSE }
    }

    return { content, error: null, errorType: null }
  } catch (err) {
    clearTimeout(timer)
    if (err.name === 'AbortError') {
      return { content: null, error: `${provider.name} timed out after ${timeoutMs}ms`, errorType: ERROR_TYPES.TIMEOUT }
    }
    return { content: null, error: `${provider.name} network error: ${err.message}`, errorType: ERROR_TYPES.NETWORK_ERROR }
  }
}

/**
 * Call AI with automatic retry for transient errors and provider fallback.
 * This is the main entry point for all AI calls.
 */
export async function callGrok(systemPrompt, userPrompt, options = {}) {
  const { temperature = 0.7, maxTokens = 4096, timeoutMs = 60000 } = options

  const providers = []
  // Primary provider
  if (CONFIG.primary.apiKey) {
    providers.push({
      provider: CONFIG.primary,
      model: CONFIG.primary.model,
      label: 'primary',
    })
  }
  // Fallback provider
  if (CONFIG.fallback?.apiKey) {
    providers.push({
      provider: CONFIG.fallback,
      model: CONFIG.fallback.model,
      label: 'fallback',
    })
  }

  if (providers.length === 0) {
    throw new Error(
      'No AI provider configured. Set PRIMARY_AI_API_KEY (or XAI_API_KEY) in Render environment variables.'
    )
  }

  let lastError = null
  let lastErrorType = null

  for (const { provider, model, label } of providers) {
    console.log(`[AI] Trying ${provider.name}/${model} (${label})...`)

    // Try this provider (with one retry for rate limits)
    const result = await callProvider(provider, model, systemPrompt, userPrompt, {
      temperature, maxTokens, timeoutMs,
    })

    if (result.content) {
      console.log(`[AI] ${provider.name}/${model} responded: ${result.content.length} chars`)
      return result.content
    }

    lastError = result.error
    lastErrorType = result.errorType

    // Rate limit — wait 60s and retry once on the same provider
    if (result.errorType === ERROR_TYPES.RATE_LIMITED) {
      console.log(`[AI] Rate limited on ${provider.name}/${model}. Waiting 60s for retry...`)
      await new Promise(r => setTimeout(r, 60000))

      const retryResult = await callProvider(provider, model, systemPrompt, userPrompt, {
        temperature, maxTokens, timeoutMs,
      })
      if (retryResult.content) {
        console.log(`[AI] ${provider.name}/${model} retry succeeded: ${retryResult.content.length} chars`)
        return retryResult.content
      }
      lastError = retryResult.error
      lastErrorType = retryResult.errorType
    }

    // Check if we should fall back to next provider
    if (!isFallbackEligible(result.errorType)) {
      // Non-fallback error (e.g., invalid response) — don't try next provider
      break
    }

    console.log(`[AI] ${provider.name}/${model} failed (${result.errorType}) — trying next provider`)
  }

  // All providers failed
  throw new Error(
    `All AI providers failed. Last error: ${lastError || 'unknown'}. Check server logs for details.`
  )
}

// ═══ JSON PARSING ═══

/**
 * Extract and parse JSON from AI response.
 * Handles: markdown fences, truncated responses, mixed text+JSON.
 */
function extractJSON(raw) {
  let jsonStr = raw

  // Step 1: Strip markdown code fences
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim()
  } else {
    jsonStr = raw.replace(/^```(?:json)?\s*/m, '').trim()
  }

  // Step 2: Strip leading non-JSON text
  const lines = jsonStr.split('\n')
  let startIdx = 0
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      startIdx = i
      break
    }
    if (i > 10) break
  }
  jsonStr = lines.slice(startIdx).join('\n')

  // Find JSON start
  const arrIdx = jsonStr.indexOf('[')
  const objIdx = jsonStr.indexOf('{')
  if (arrIdx >= 0 && (objIdx < 0 || arrIdx < objIdx)) {
    jsonStr = jsonStr.slice(arrIdx)
  } else if (objIdx >= 0) {
    jsonStr = jsonStr.slice(objIdx)
  }

  // Step 3: Try parsing as-is
  try { return JSON.parse(jsonStr) } catch {}

  // Step 4: Repair truncated/malformed JSON
  try {
    let fixed = jsonStr
    fixed = fixed.replace(/,\s*([\]\}])/g, '$1')
    fixed = fixed.replace(/,\s*$/, '')

    const quoteCount = (fixed.match(/(?<!\\)"/g) || []).length
    if (quoteCount % 2 !== 0) {
      fixed = fixed.replace(/:\s*"[^"]*$/, ': ""')
      fixed = fixed.replace(/,\s*"[^"]*$/, '')
      fixed = fixed.replace(/\{\s*"[^"]*$/, '{')
    }

    fixed = fixed.replace(/,\s*"[^"]*\s*:\s*$/, '')
    fixed = fixed.replace(/"[^"]*\s*:\s*$/, '')

    const lastBrace = fixed.lastIndexOf('}')
    if (lastBrace > 0) fixed = fixed.slice(0, lastBrace + 1)

    const openSquare = (fixed.match(/\[/g) || []).length - (fixed.match(/\]/g) || []).length
    const openCurly = (fixed.match(/\{/g) || []).length - (fixed.match(/\}/g) || []).length
    fixed += '}'.repeat(Math.max(0, openCurly)) + ']'.repeat(Math.max(0, openSquare))

    const parsed = JSON.parse(fixed)
    console.warn(`[AI] Repaired truncated JSON — recovered ${Array.isArray(parsed) ? parsed.length : 1} items`)
    return parsed
  } catch (repairErr) {
    console.error('[AI] JSON repair failed:', repairErr.message)
  }

  // Step 5: Extract individual question objects via regex
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

  throw new Error('Could not parse AI response as JSON')
}

/**
 * Validate a single quiz question.
 */
function validateQuestion(q) {
  if (!q || typeof q !== 'object') return null
  if (!q.prompt || typeof q.prompt !== 'string') return null
  const prompt = q.prompt.trim()
  if (prompt.length < 5) return null
  if (!Array.isArray(q.options) || q.options.length !== 4) return null
  if (q.options.some(o => !o || !String(o).trim())) return null
  if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) return null
  if (!Number.isInteger(q.correctAnswer)) return null
  return {
    prompt,
    options: q.options.map(o => String(o).trim()),
    correctAnswer: q.correctAnswer,
    explanation: (q.explanation || 'No explanation provided').trim().slice(0, 200),
  }
}

// ═══ PUBLIC API ═══

/**
 * Call AI and parse as JSON, with retry on parse failure.
 */
export async function callGrokJSON(systemPrompt, userPrompt, options = {}) {
  const raw = await callGrok(systemPrompt, userPrompt, { ...options, temperature: 0.3 })

  try {
    return extractJSON(raw)
  } catch (firstErr) {
    console.warn('[AI] First parse attempt failed, retrying with stricter prompt...')
    const retryRaw = await callGrok(
      'Return ONLY a valid JSON array in English. No text before or after. No markdown fences. All content must be in English.',
      userPrompt,
      { ...options, temperature: 0.1, maxTokens: options.maxTokens || 4096 }
    )
    return extractJSON(retryRaw)
  }
}

/**
 * Generate and validate quiz questions.
 * Returns only valid questions, never raw AI output.
 */
export async function generateAndValidateQuestions(systemPrompt, userPrompt, options = {}) {
  let parsed = await callGrokJSON(systemPrompt, userPrompt, options)

  // Normalize: unwrap object wrappers
  if (parsed && !Array.isArray(parsed) && Array.isArray(parsed.questions)) parsed = parsed.questions
  if (parsed && !Array.isArray(parsed) && Array.isArray(parsed.data)) parsed = parsed.data

  if (!Array.isArray(parsed)) {
    throw new Error('AI did not return an array of questions')
  }

  const valid = []
  const seen = new Set()
  let invalidCount = 0
  let duplicateCount = 0

  for (let i = 0; i < parsed.length; i++) {
    const q = validateQuestion(parsed[i])
    if (!q) { invalidCount++; continue }
    const key = q.prompt.toLowerCase().slice(0, 50)
    if (seen.has(key)) { duplicateCount++; continue }
    seen.add(key)
    valid.push(q)
  }

  if (valid.length === 0) {
    throw new Error(`AI returned 0 valid questions (${parsed.length} total, ${invalidCount} invalid, ${duplicateCount} duplicates)`)
  }

  console.log(`[AI] Validated ${valid.length}/${parsed.length} questions (${invalidCount} invalid, ${duplicateCount} duplicates removed)`)
  return valid
}

/**
 * Generate quiz questions — BATCHED to prevent truncation.
 * Generates in batches of 10 to stay within token limits.
 */
export async function generateQuizQuestions({ subject, topic, difficulty, count, context, previousQuestions = [] }) {
  const BATCH_SIZE = 10
  const allQuestions = []
  const seenPrompts = new Set()
  let attempts = 0
  const maxAttempts = Math.ceil(count / BATCH_SIZE) + 4
  let consecutiveFailures = 0

  console.log(`[QuizBatch] Requesting ${count} questions, batch size ${BATCH_SIZE}`)

  while (allQuestions.length < count && attempts < maxAttempts) {
    attempts++
    const remaining = count - allQuestions.length
    const batchSize = Math.min(BATCH_SIZE, remaining)

    const systemPrompt = `Generate exactly ${batchSize} MCQ questions about ${topic} (${subject}). Difficulty: ${difficulty}.

CRITICAL: All questions, options, and explanations MUST be written in English. Do NOT use any other language.

Return ONLY a JSON array of exactly ${batchSize} objects. No text before or after.
Each object: {"prompt":"question?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"why"}`

    const prevSlice = allQuestions.slice(-3).map(q => q.prompt.slice(0, 40)).join('; ')
    const userPrompt = context
      ? `Study material:\n${context.slice(0, 1500)}\n\nGenerate exactly ${batchSize} questions about "${topic}".${prevSlice ? ` Avoid: ${prevSlice}` : ''}`
      : `Generate exactly ${batchSize} ${difficulty} MCQ questions about "${topic}" in ${subject}.${prevSlice ? ` Avoid: ${prevSlice}` : ''}`

    try {
      const batch = await generateAndValidateQuestions(systemPrompt, userPrompt, {
        temperature: 0.4,
        maxTokens: 4096,
      })

      for (const q of batch) {
        const key = q.prompt.toLowerCase().slice(0, 50)
        if (!seenPrompts.has(key)) {
          seenPrompts.add(key)
          allQuestions.push(q)
        }
      }
      consecutiveFailures = 0
      console.log(`[QuizBatch] Batch ${attempts}: got ${batch.length} questions, total ${allQuestions.length}/${count}`)
    } catch (err) {
      consecutiveFailures++
      console.error(`[QuizBatch] Batch ${attempts} failed (${consecutiveFailures} consecutive):`, err.message)
      if (consecutiveFailures >= 3) break
    }

    if (allQuestions.length < count && attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 3000))
    }
  }

  if (allQuestions.length === 0) {
    throw new Error('Failed to generate any valid questions')
  }

  console.log(`[QuizBatch] Generated ${allQuestions.length} questions in ${attempts} batches`)
  return allQuestions
}

/**
 * Analyze syllabus text and extract structured topics.
 */
export async function analyzeSyllabus(syllabusText) {
  const systemPrompt = `Extract topics from syllabus text. All output MUST be in English.
Return JSON:
{"subjects":[{"name":"...","units":[{"name":"...","topics":[{"name":"...","difficulty":"easy|medium|hard","importance":"high|medium|low"}]}]}]}
Return ONLY valid JSON.`
  return callGrokJSON(systemPrompt, `Syllabus:\n${syllabusText}`, { maxTokens: 3000 })
}

/**
 * Analyze study material and extract knowledge chunks.
 */
export async function analyzeStudyMaterial(text, subject = '') {
  const systemPrompt = `Analyze study material. All output MUST be in English.
Return JSON:
{"subject":"...","topics":[{"name":"...","difficulty":"...","keyConcepts":["..."],"chunks":[{"title":"...","content":"...","concepts":["..."]}]}]}
Return ONLY valid JSON.`
  return callGrokJSON(systemPrompt, `Subject: ${subject || 'auto-detect'}\n\nMaterial:\n${text}`, { maxTokens: 3000 })
}

/**
 * Generate question explanation.
 */
export async function explainQuestion(question, correctAnswer, selectedAnswer, topic) {
  const systemPrompt = `Explain why the correct answer is right. Be concise (under 100 words). All output MUST be in English.`
  const userPrompt = `Q: ${question}\nCorrect: ${correctAnswer}\nStudent chose: ${selectedAnswer}\nTopic: ${topic}`
  return callGrok(systemPrompt, userPrompt, { maxTokens: 500 })
}

/**
 * Generate AI insights from student performance data.
 */
export async function generateInsights(studentData) {
  const systemPrompt = `Analyze student performance. All output MUST be in English.
Return JSON array:
[{"type":"strength|weakness|improvement|action","text":"insight","emoji":"📊","priority":"low|medium|high","subject":"...","topic":"..."}]
Generate 3-6 insights. Return ONLY valid JSON.`
  return callGrokJSON(systemPrompt, `Performance:\n${JSON.stringify(studentData, null, 2)}`, { maxTokens: 2000 })
}

/**
 * Generate adaptive study recommendations.
 */
export async function generateRecommendations(studentContext) {
  const systemPrompt = `Recommend what to study next. All output MUST be in English.
Return JSON:
{"primaryRecommendation":{"subject":"...","topic":"...","reason":"...","estimatedMinutes":45},"secondaryRecommendations":[...],"octoMessage":"..."}
Return ONLY valid JSON.`
  return callGrokJSON(systemPrompt, `Context:\n${JSON.stringify(studentContext, null, 2)}`, { maxTokens: 2000 })
}

/**
 * Replan study schedule based on new quiz results.
 */
export async function replanSchedule(currentPlan, quizResult, studentContext) {
  const systemPrompt = `Adjust study schedule after quiz. All output MUST be in English.
Return JSON:
{"reason":"...","changes":[{"subject":"...","topic":"...","oldMinutes":30,"newMinutes":50,"reason":"..."}],"octoMessage":"..."}
Return ONLY valid JSON.`
  return callGrokJSON(systemPrompt, `Plan:\n${JSON.stringify(currentPlan, null, 2)}\nQuiz:\n${JSON.stringify(quizResult, null, 2)}`, { maxTokens: 2000 })
}

/**
 * Generate Octo's contextual message.
 */
export async function generateOctoMessage(context) {
  const systemPrompt = `You are Octo, a study companion. Generate a brief encouraging message (1-2 sentences, 0-1 emojis) in English. Return ONLY the message text.`
  return callGrok(systemPrompt, `Context: ${JSON.stringify(context)}`, { maxTokens: 150, temperature: 0.8 })
}

/**
 * Get current provider status (for health checks).
 */
export function getProviderStatus() {
  return {
    primary: {
      name: CONFIG.primary.name,
      model: CONFIG.primary.model,
      configured: !!CONFIG.primary.apiKey,
    },
    fallback: CONFIG.fallback ? {
      name: CONFIG.fallback.name,
      model: CONFIG.fallback.model,
      configured: !!CONFIG.fallback.apiKey,
    } : null,
  }
}
