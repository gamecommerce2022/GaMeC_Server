import { NextFunction, Request, Response } from 'express'
import { User } from '../../domain_user/model'
import * as Product from '../../domain_product/info/model'
import Stripe from 'stripe'
export default class ShoppingController {
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
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/`,
            cancel_url: `${req.protocol}://${req.get('host')}/`,
            customer_email: req.body.user.email,
            client_reference_id: req.params.productId,
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
        //3) Create session as response
        return res.status(200).json({ status: 'Success', session })
    }
}
