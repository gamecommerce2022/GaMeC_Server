import express from 'express'
import AuthController from '../controller/auth_controller'
import { ValidateJoi } from '@app/middleware/Joi'
import { Schemas } from '@app/domain_user/middleware'
const router = express.Router()

/**authentication */
const authPrefix = 'v1/auth'

router.post(`${authPrefix}/register`, ValidateJoi(Schemas.user.create), AuthController.register)

export default router;