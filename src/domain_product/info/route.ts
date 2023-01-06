import express from 'express'
import uploadImage from '../../library/loader/firebase.loader'
import multer = require('multer')
import ProductController from './controller'
import AuthController from '../../domain_auth/controller/auth_controller'

const Multer = multer({
    storage: multer.memoryStorage(),
})

const router = express.Router()

/** Product */
const productPrefix = '/products'
/** Create Product */
router.post(`${productPrefix}`, AuthController.protect, AuthController.restrictTo('admin'), ProductController.create)
router.post(`${productPrefix}/images`, Multer.single('image'), uploadImage)

/** Read Product */
router.get(`${productPrefix}/get/:productId`, ProductController.read)
router.get(`${productPrefix}/get5Products`, ProductController.getRandom5Product)
router.get(`${productPrefix}/all`, ProductController.readAll)
router.get(`${productPrefix}`, ProductController.readByPage)
router.get(`${productPrefix}/length`, ProductController.readPageNumber)

/** Update Product */
router.put(`${productPrefix}/:productId`, AuthController.protect, AuthController.restrictTo('admin'), ProductController.update)

/** Delete Product */
router.delete(`${productPrefix}/:productId`, AuthController.protect, AuthController.restrictTo('admin'), ProductController.delete)

export default router
