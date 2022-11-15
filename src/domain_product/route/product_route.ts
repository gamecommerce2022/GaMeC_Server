import express from 'express'
import { Product } from '../controller'
import { Schemas } from '../middleware'
import { ValidateJoi } from '../../middleware/Joi'

const router = express.Router()

/** Product */
const productPrefix = '/products'
/** Create Product */
router.post(`${productPrefix}`, Product.default.create)

/** Read Product */
router.get(`${productPrefix}/get/:productId`, Product.default.read)
router.get(`${productPrefix}/all`, Product.default.readAll)
router.get(`${productPrefix}`, Product.default.readByPage)
router.get(`${productPrefix}/length`, Product.default.readPageNumber)

/** Update Product */
router.put(`${productPrefix}/:productId`,  Product.default.update)

/** Delete Product */
router.delete(`${productPrefix}/:productId`, Product.default.delete)

export default router
