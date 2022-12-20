import express from "express"
import AuthController from "../../domain_auth/controller/auth_controller"
import ShoppingController from "../shopping/controller"
import CommentController from "./controller"

const router = express.Router()

const commentPrefix = '/comments'

router.get(`${commentPrefix}/getProduct/:productId`, CommentController.getCommentsByProduct)
router.get(`${commentPrefix}/getUser/:userId`, CommentController.getCommentsByUser)

router.post(`${commentPrefix}`, CommentController.create)



router.put(`${commentPrefix}/:commentId`, CommentController.like)

export default router