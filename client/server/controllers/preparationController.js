import { Preparation } from '../models/Preparation.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { emptyPreparation, toClientPreparation } from '../utils/emptyPreparation.js'

function ownerFilter(req) {
  return { userId: req.user.userId }
}

function sanitizeBody(body) {
  const source = body?.preparation && typeof body.preparation === 'object' ? body.preparation : body
  const {
    _id,
    __v,
    userId,
    passwordHash,
    demoMode,
    ...rest
  } = source || {}
  return rest
}

async function getOrCreate(req) {
  let doc = await Preparation.findOne(ownerFilter(req))
  if (!doc) {
    doc = await Preparation.create({
      userId: req.user.userId,
      ...emptyPreparation(),
      student: { name: req.user.name, email: req.user.email },
    })
  }
  return doc
}

export const getPreparation = asyncHandler(async (req, res) => {
  const doc = await getOrCreate(req)
  return res.json({ success: true, data: toClientPreparation(doc) })
})

export const savePreparation = asyncHandler(async (req, res) => {
  const patch = sanitizeBody(req.body)
  const doc = await Preparation.findOneAndUpdate(
    ownerFilter(req),
    {
      $set: {
        ...patch,
        userId: req.user.userId,
        student: patch.student || { name: req.user.name, email: req.user.email },
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  )
  return res.json({ success: true, data: toClientPreparation(doc) })
})

export const deletePreparation = asyncHandler(async (req, res) => {
  await Preparation.findOneAndUpdate(ownerFilter(req), { $set: emptyPreparation() }, { new: true })
  const doc = await getOrCreate(req)
  return res.json({ success: true, data: toClientPreparation(doc) })
})
