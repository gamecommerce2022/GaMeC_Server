import express from 'express'
import { Product } from '../controller'
import { Schemas } from '../middleware'
import { ValidateJoi } from '../../middleware/Joi'
import multer from 'multer'

const router = express.Router()

/** Product */
const productPrefix = '/products'
/** Create Product */
router.post(`${productPrefix}`, ValidateJoi(Schemas.product.create), Product.default.create)
router.post(`${productPrefix}/images`, multer().single('image'), Product.default.updateImage)

/** Read Product */
router.get(`${productPrefix}/get/:productId`, Product.default.read)
router.get(`${productPrefix}/all`, Product.default.readAll)
router.get(`${productPrefix}`, Product.default.readByPage)
router.get(`${productPrefix}/length`, Product.default.readPageNumber)

/** Update Product */
router.put(`${productPrefix}/:productId`, ValidateJoi(Schemas.product.update), Product.default.update)

/** Delete Product */
router.delete(`${productPrefix}/:productId`, Product.default.delete)

export default router
