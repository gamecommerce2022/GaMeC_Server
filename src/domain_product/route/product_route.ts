import express from 'express'
import { Product } from '../controller'
import { Schemas } from '../middleware'
import { ValidateJoi } from '../../middleware/Joi'

const router = express.Router()

/** Product */
const productPrefix = '/v1/product'
/** Create Product */
router.post(`${productPrefix}/create`, ValidateJoi(Schemas.product.create), Product.default.create)

/** Read Product */
router.get(`${productPrefix}/get/:productId`, Product.default.read)
router.get(`${productPrefix}/getAll/`, Product.default.readAll)
router.get(`${productPrefix}/get/`, Product.default.readByPage)
router.get(`${productPrefix}/getLength/`, Product.default.readPageNumber)

/** Update Product */
router.patch(`${productPrefix}/update/:productId`, ValidateJoi(Schemas.product.update), Product.default.update)

/** Delete Product */
router.delete(`${productPrefix}/delete/:productId`, Product.default.delete)

export default router
