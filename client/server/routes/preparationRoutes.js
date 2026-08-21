import { Router } from 'express'
import { deletePreparation, getPreparation, savePreparation } from '../controllers/preparationController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export const preparationRoutes = Router()

preparationRoutes.use(authMiddleware)
preparationRoutes.get('/', getPreparation)
preparationRoutes.post('/', savePreparation)
preparationRoutes.put('/', savePreparation)
preparationRoutes.delete('/', deletePreparation)
