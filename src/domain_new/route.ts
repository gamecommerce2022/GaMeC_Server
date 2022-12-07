import express from 'express'
import uploadImage from '../library/loader/firebase.loader'
import multer = require('multer')
import NewsController from './controller'

const Multer = multer({
    storage: multer.memoryStorage(),
})

const router = express.Router()

/** News */
const newsPrefix = '/news'
/** Create News */
router.post(`${newsPrefix}`, NewsController.create)
router.post(`${newsPrefix}/images`, Multer.single('image'), uploadImage)

/** Read News */
router.get(`${newsPrefix}/get/:newsId`, NewsController.read)
router.get(`${newsPrefix}`, NewsController.readByPage)
router.get(`${newsPrefix}/length`, NewsController.readPageNumber)

/** Update News */
router.put(`${newsPrefix}/:newsId`, NewsController.update)

/** Delete News */
router.delete(`${newsPrefix}/:newsId`, NewsController.delete)

export default router