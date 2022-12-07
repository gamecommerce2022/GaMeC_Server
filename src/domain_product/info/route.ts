import express from 'express'
import { ValidateJoi } from '../../middleware/Joi'
import uploadImage from '../../library/loader/firebase.loader'
import multer = require('multer')
import ProductController from './controller'
import { Schemas } from './schema'

const Multer = multer({
    storage: multer.memoryStorage(),
})

const router = express.Router()

/** Product */
const productPrefix = '/products'
/** Create Product */
router.post(`${productPrefix}`, ValidateJoi(Schemas.product.create), ProductController.create)
router.post(`${productPrefix}/images`, Multer.single('image'), uploadImage)

/** Read Product */
router.get(`${productPrefix}/get/:productId`, ProductController.read)
router.get(`${productPrefix}/all`, ProductController.readAll)
router.get(`${productPrefix}`, ProductController.readByPage)
router.get(`${productPrefix}/length`, ProductController.readPageNumber)

/** Update Product */
router.put(`${productPrefix}/:productId`, ProductController.update)

/** Delete Product */
router.delete(`${productPrefix}/:productId`, ProductController.delete)

export default router
