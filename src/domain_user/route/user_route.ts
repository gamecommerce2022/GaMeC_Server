import express from 'express'
import AuthController from '../../domain_auth/controller/auth_controller'
import { ValidateJoi } from '../../middleware/Joi'
import { User } from '../controller'
import { Schemas } from '../middleware'

const router = express.Router()
const userPrefix = '/user'
router.post(`${userPrefix}/create`, ValidateJoi(Schemas.user.create), User.default.create)
router.get(`${userPrefix}/get/:userId`, User.default.read)
router.get(`${userPrefix}/get/`, AuthController.protect, User.default.readAll)

router.patch(`${userPrefix}/update-password`, AuthController.protect, AuthController.updatePassword)

router.patch(`${userPrefix}/update-me`, AuthController.protect, User.default.updateMe)

router.delete(
    `${userPrefix}/delete/:userId`,
    AuthController.protect,
    AuthController.restrictTo('admin'),
    User.default.delete
)
router.post(`${userPrefix}/get-current-user`, User.default.getCurrentUser)
export default router
