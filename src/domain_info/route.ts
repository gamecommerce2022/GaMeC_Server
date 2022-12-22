import express from 'express'
import ReportController from './controller'
import ProfileController from './info_controller'

const router = express.Router()

const reportPrefix = '/reports'
const profilePrefix = '/profile'

router.post(`${reportPrefix}`, ReportController.create)
router.get(`${reportPrefix}`, ReportController.getByPage)
router.get(`${reportPrefix}/getLength`, ReportController.getLength)

router.get(`${profilePrefix}`, ProfileController.get)
router.post(`${profilePrefix}`, ProfileController.create)
router.put(`${profilePrefix}`, ProfileController.update)

export default router