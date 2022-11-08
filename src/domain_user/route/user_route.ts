import express from 'express'
import { ValidateJoi } from '../../middleware/Joi'
import { User } from '../controller'
import { Schemas } from '../middleware'

const router = express.Router()

router.post('/create', ValidateJoi(Schemas.user.create), User.default.create)
router.get('/get/:userId', User.default.read)
router.get('/get/', User.default.readAll)
router.patch('/update/:userId', ValidateJoi(Schemas.user.create), User.default.update)
router.delete('/delete/:userId', User.default.delete)

export default router
