import mongoose from 'mongoose'
import { emptyPreparation } from '../utils/emptyPreparation.js'

const mixed = { type: mongoose.Schema.Types.Mixed, default: undefined }

const preparationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    student: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    setupCompleted: { type: Boolean, default: false },
    onboardingComplete: { type: Boolean, default: false },
    analysisStatus: { type: String, default: 'idle' },
    timetableFile: mixed,
    exams: { type: [mongoose.Schema.Types.Mixed], default: [] },
    subjects: { type: [mongoose.Schema.Types.Mixed], default: [] },
    uploadedMaterials: { type: [mongoose.Schema.Types.Mixed], default: [] },
    preferences: { type: mongoose.Schema.Types.Mixed, default: () => emptyPreparation().preferences },
    progress: { type: mongoose.Schema.Types.Mixed, default: {} },
    quizResults: { type: [mongoose.Schema.Types.Mixed], default: [] },
    quizHistory: { type: [mongoose.Schema.Types.Mixed], default: [] },
    weakTopics: { type: [mongoose.Schema.Types.Mixed], default: [] },
    studyPlan: { type: [mongoose.Schema.Types.Mixed], default: [] },
    planUpdates: { type: [mongoose.Schema.Types.Mixed], default: [] },
    analytics: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
)

export const Preparation = mongoose.model('Preparation', preparationSchema)
