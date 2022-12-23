/* eslint-disable */
import { NextFunction, Request, Response } from 'express'
import { User } from '../../domain_user/model'
import * as Product from '../info/model'

import * as Shopping from '../shopping/model'
import Stripe from 'stripe'
import { CheckoutStatus } from './type'
export default class ShoppingController {
    public static createShopping = async (checkoutSession: Stripe.Checkout.Session, products: Product.IProductModel) => {
        const user = await User.default.findOne({ email: checkoutSession.customer_details?.email })
        console.log(JSON.stringify(checkoutSession))
        const json = JSON.parse(JSON.stringify(checkoutSession))
        const shopping = await new Shopping.default({
            stripeId: json.id,
            userId: user?.id,
            date: new Date(checkoutSession.created),
            paymentStatus: 'pending',
            deliverStatus: 'waiting',
            total: checkoutSession.amount_total,
            products: [products],
        })
        await shopping.save()
        // const
    }
    public static addToFavorites = async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.default.findById(req.body.user.id)

        if (!user) return next(res.status(401).json({ statusCode: 401, message: 'Unauthorized' }))
        if (user.favorites.includes(req.body.productId))
            return res.status(409).json({ statusCode: 409, message: 'Item already existed' })
        user.addToFavorites(req.body.productId)
        await user.save({ validateBeforeSave: false })
        return next(res.status(200).json({ statusCode: 200, message: 'Success' }))
    }
    public static removeFromFavorites = async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.default.findById(req.body.user.id)

        if (!user) return next(res.status(401).json({ statusCode: 401, message: 'Unauthorized' }))

        if (!user.favorites.includes(req.body.productId))
            return res.status(404).json({ statusCode: 404, message: 'Item not found is list' })

        user.removeFromFavorites(req.body.productId)
        await user.save({ validateBeforeSave: false })
        return next(res.status(200).json({ statusCode: 200, message: 'Success' }))
    }
    public static getFavorites = async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.default.findById(req.body.user.id)
        if (!user) return next(res.status(401).json({ statusCode: 401, message: 'Unauthorized', data: null }))

        return next(res.status(200).json({ statusCode: 200, message: 'Success', data: user.toObject().favorites }))
    }

    public static getCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
        //1) Get the currently selected product
        const product = await Product.default.findById(req.params.productId)
        //2) Create checkout session
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2022-11-15' })
        // const session = await stripe.checkout.sessions.list({ customer_details: { email: '19522281@gm.uit.edu.vn' }, })
        // const stripeCheckout = await stripe.charges.retrieve("sssss",)
        // console.log(session.data)
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/`,
            cancel_url: `${req.protocol}://${req.get('host')}/`,
            customer_email: req.body.user.email,
            client_reference_id: req.params.productId,
            shipping_address_collection: { allowed_countries: ['VN'] },
            line_items: [
                {
                    price_data: {
                        currency: 'VND',
                        product_data: {
                            name: product?.title ?? '',
                            description: product?.shortDescription,
                            images: product?.imageList,
                        },
                        unit_amount: product?.price,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
        })

        await ShoppingController.createShopping(checkoutSession, product!)

        console.log('New shopping added successfully')

        //3) Create session as response
        return res.status(200).json({ status: 'Success', session: checkoutSession })
    }
    public static updateBillingStatus = async (paymentId: string, checkoutStatus: CheckoutStatus) => {
        await Shopping.default.findOneAndUpdate({ stripeId: paymentId }, { paymentStatus: checkoutStatus })
    }
}
