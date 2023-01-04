import express from 'express'

import AuthController from '../../domain_auth/controller/auth_controller'
import ShoppingController from './controller'
const router = express.Router()

/**authentication */
const shoppingPrefix = '/shopping'

router.post(`${shoppingPrefix}/add-to-favorites`, AuthController.protect, ShoppingController.addToFavorites)
router.post(`${shoppingPrefix}/remove-from-favorites`, AuthController.protect, ShoppingController.removeFromFavorites)

router.get(`${shoppingPrefix}/get-favorites`, AuthController.protect, ShoppingController.getFavorites)
router.get(`${shoppingPrefix}/get-checkout-sessions`, AuthController.protect, ShoppingController.getCheckoutSessions)
router.get(`${shoppingPrefix}/get-checkout-session/:id`, AuthController.protect, ShoppingController.getCheckoutById)
router.post(`${shoppingPrefix}/add-to-carts`, AuthController.protect, ShoppingController.addToCart)
router.post(`${shoppingPrefix}/remove-from-carts`, AuthController.protect, ShoppingController.removeFromCart)

router.get(`${shoppingPrefix}/get-carts`, AuthController.protect, ShoppingController.getCarts)
router.get(
    `${shoppingPrefix}/get-payment-intent/:id`,
    AuthController.protect,
    AuthController.restrictTo('admin'),
    ShoppingController.getPaymentIntent
)
router.get(`${shoppingPrefix}/get-charge/:id`, AuthController.protect, ShoppingController.getCharge)
router.get(
    `${shoppingPrefix}/get-raw-checkout-session/:id`,
    AuthController.protect,
    ShoppingController.getRawCheckoutSessionFromStripe
)
router.post(`${shoppingPrefix}/create-checkout-session`, AuthController.protect, ShoppingController.createCheckoutSession)
router.post(`${shoppingPrefix}/send-invoice`, AuthController.protect, ShoppingController.sendInvoice)
export default router
