import express from 'express'

import AuthController from '../../domain_auth/controller/auth_controller'
import ShoppingController from './controller'
const router = express.Router()

/**authentication */
const shoppingPrefix = '/shopping'

router.post(`${shoppingPrefix}/add-to-favorites`, AuthController.protect, ShoppingController.addToFavorites)
router.post(`${shoppingPrefix}/remove-from-favorites`, AuthController.protect, ShoppingController.removeFromFavorites)

router.get(`${shoppingPrefix}/get-favorites`, AuthController.protect, ShoppingController.getFavorites)


router.get(`${shoppingPrefix}/checkout-session/:productId`, AuthController.protect, ShoppingController.getCheckoutSession)
export default router
