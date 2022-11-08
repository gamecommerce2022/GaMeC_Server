import express from 'express'
import { Brand } from '../controller'
import { Schemas } from '../middleware'
import { ValidateJoi } from '../../middleware/Joi'

const router = express.Router()

/** brand */
const brandPrefix = '/v1/brand'
/** Create brand */
router.post(`${brandPrefix}/create`, ValidateJoi(Schemas.brand.create), Brand.default.create)

/** Read brand */
router.get(`${brandPrefix}/get/:brandId`, Brand.default.read)
router.get(`${brandPrefix}/get/`, Brand.default.readAll)

/** Update brand */
router.patch(`${brandPrefix}/update/:brandId`, ValidateJoi(Schemas.brand.update), Brand.default.update)

/** Delete brand */
router.delete(`${brandPrefix}/delete/:brandId`, Brand.default.delete)

export default router
