import express from 'express'
import AuthController from '../controller/auth_controller'
import { ValidateJoi } from '../../middleware/Joi'
import { Schemas } from '../../domain_user/middleware'
const router = express.Router()

/**authentication */
const authPrefix = '/v1/auth'

router.post(`${authPrefix}/register`, ValidateJoi(Schemas.user.create), AuthController.register)
router.post(`${authPrefix}/login`, AuthController.login)

export default router
