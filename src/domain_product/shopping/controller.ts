/* eslint-disable */
import { NextFunction, Request, Response } from 'express'
import { User } from '../../domain_user/model'
import * as Product from '../info/model'

import * as Shopping from '../shopping/model'
import Stripe from 'stripe'
import { CheckoutStatus } from './type'
import { ObjectId } from 'mongoose'
import axios from 'axios'
export default class ShoppingController {
    public static getCheckoutById = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id
        const shopping = await Shopping.default.findById(id)
        if (!shopping) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Shopping not found',
                shopping,
            })
        }
        return res.status(200).json({
            statusCode: 200,
            message: 'Success',
            shopping,
        })
    }
    public static getCheckoutSessions = async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.query.email)
        const email = req.query.email
        let shoppings = []

        let pageNumber = 0
        if (req.query.page) {
            pageNumber = parseInt(req.query.pageNumber as string)
        }
        let pageLimit = 30
        if (req.query.perPage) {
            pageLimit = parseInt(req.query.perPage as string)
        }
        let users
        if (req.query.sort) {
            const typeSort = parseInt(req.query.sort as string)
            switch (typeSort) {
                //By EMAIL A-Z
                case 1:
                    users = await User.default
                        .find(email === '' ? {} : { email: { $regex: `${email}`, $options: '$i' } })
                        .sort({ email: 1 })
                    for (const user of users) {
                        const shopping = await Shopping.default
                            .find({ userId: user.id })
                            .skip(pageNumber * pageLimit)
                            .limit(pageLimit)
                        shoppings.push(...shopping)
                    }
                    return res.status(200).json({ status: 'Success', data: shoppings })
                //By EMAIL Z-A
                case 2:
                    users = await User.default
                        .find(email === '' ? {} : { email: { $regex: `${email}`, $options: '$i' } })
                        .sort({ email: -1 })
                    for (const user of users) {
                        const shopping = await Shopping.default
                            .find({ userId: user.id })
                            .skip(pageNumber * pageLimit)
                            .limit(pageLimit)
                        shoppings.push(...shopping)
                    }
                    return res.status(200).json({ status: 'Success', data: shoppings })
                //By total ascending
                case 3:
                    users = await User.default.find(email === '' ? {} : { email: { $regex: `${email}`, $options: '$i' } })
                    for (const user of users) {
                        const shopping = await Shopping.default
                            .find({ userId: user.id })
                            .skip(pageNumber * pageLimit)
                            .limit(pageLimit)
                            .sort({ total: 1 })
                        shoppings.push(...shopping)
                    }
                    shoppings = shoppings.sort((a, b) => (a.total > b.total ? 1 : -1))
                    return res.status(200).json({ status: 'Success', data: shoppings })
                //By total descending
                case 4:
                    users = await User.default.find(email === '' ? {} : { email: { $regex: `${email}`, $options: '$i' } })
                    for (const user of users) {
                        const shopping = await Shopping.default
                            .find({ userId: user.id })
                            .skip(pageNumber * pageLimit)
                            .limit(pageLimit)
                            .sort({ total: -1 })
                        shoppings.push(...shopping)
                    }
                    shoppings = shoppings.sort((a, b) => (a.total < b.total ? 1 : -1))

                    return res.status(200).json({ status: 'Success', data: shoppings })
            }
        }
    }

    public static createShopping = async (
        checkoutSession: Stripe.Checkout.Session,
        products: ((Product.IProductModel & { _id: ObjectId }) | null)[]
    ) => {
        const user = await User.default.findOne({ email: checkoutSession.customer_details?.email })
        const json = JSON.parse(JSON.stringify(checkoutSession))
        const shopping = await new Shopping.default({
            stripeId: json.id,
            paymentIntentId: json.payment_intent,
            userId: user?.id,
            date: new Date().toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' }),
            paymentStatus: 'pending',
            deliverStatus: 'waiting',
            total: checkoutSession.amount_total,
            products: products,
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

    public static addToCart = async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.default.findById(req.body.user.id)

        if (!user) return next(res.status(401).json({ statusCode: 401, message: 'Unauthorized' }))
        if (user.carts.includes(req.body.productId))
            return res.status(409).json({ statusCode: 409, message: 'Item already existed' })
        user.addToCart(req.body.productId)
        await user.save({ validateBeforeSave: false })
        return next(res.status(200).json({ statusCode: 200, message: 'Success' }))
    }
    public static removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.default.findById(req.body.user.id)

        if (!user) return next(res.status(401).json({ statusCode: 401, message: 'Unauthorized' }))

        if (!user.carts.includes(req.body.productId))
            return res.status(404).json({ statusCode: 404, message: 'Item not found is list' })

        user.removeFromCart(req.body.productId)
        await user.save({ validateBeforeSave: false })
        return next(res.status(200).json({ statusCode: 200, message: 'Success' }))
    }
    public static getCarts = async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.default.findById(req.body.user.id)
        if (!user) return next(res.status(401).json({ statusCode: 401, message: 'Unauthorized', data: null }))

        return next(res.status(200).json({ statusCode: 200, message: 'Success', data: user.toObject().carts }))
    }

    public static createCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
        //1) Get the currently selected product
        const products: ((Product.IProductModel & { _id: ObjectId }) | null)[] = []
        const productsId = req.body.products
        console.log(productsId)

        for await (const productId of productsId) {
            const product = await Product.default.findById(productId)
            products.push(product)
        }
        console.log('products' + products)

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
        console.log(lineItems)
        for await (const product of products) {
            const lineItem = {
                price_data: {
                    currency: 'VND',
                    product_data: {
                        name: product?.title ?? '',
                        description: product?.shortDescription.trim() === '' ? product.title : product?.shortDescription,
                        // images: product?.imageList,
                    },
                    unit_amount: product?.price! * (1 - (product?.discount! ?? 0)),
                },
                quantity: 1,
            }

            lineItems.push(lineItem)
        }
        console.log(lineItems)

        //2) Create checkout session
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2022-11-15' })
        // const session = await stripe.checkout.sessions.list({ customer_details: { email: '19522281@gm.uit.edu.vn' }, })
        // const stripeCheckout = await stripe.charges.retrieve("sssss",)
        // console.log(session.data)
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `http://localhost:3000`,
            cancel_url: `http://localhost:3000`,
            customer_email: req.body.user.email,
            client_reference_id: req.params.productId,
            shipping_address_collection: { allowed_countries: ['VN'] },
            line_items: lineItems,
            mode: 'payment',
        })

        await ShoppingController.createShopping(checkoutSession, productsId)

        console.log('New shopping added successfully')

        //3) Create session as response
        return res.status(200).json({ status: 'Success', session: checkoutSession })
    }
    public static updateBillingStatus = async (paymentId: string, checkoutStatus: CheckoutStatus) => {
        console.log('payment id is' + paymentId)

        const shopping = await Shopping.default.findOne({
            stripeId: paymentId,
        })

        console.log('shopping is ' + shopping)
        if (shopping === null) return
        shopping.paymentStatus = checkoutStatus
        shopping.save()
        const user = await User.default.findById(shopping?.userId)
        if (checkoutStatus === 'success') {
            console.log('removing all cart')
            user?.removeAllCart()
            await user!.save({ validateBeforeSave: false })
        }
        // await Shopping.default.findOneAndUpdate({ stripeId: paymentId }, { paymentStatus: checkoutStatus })
    }

    public static getPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2022-11-15' })
        // const session = await stripe.paymentIntents.retrieve(paymentIntent)
        const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id)
        if (!paymentIntent)
            return res.status(404).json({ statusCode: 404, message: 'No payment intent found', paymentIntent })
        return res.status(200).json({ statusCode: 200, message: 'Success', paymentIntent })
    }

    public static getCharge = async (req: Request, res: Response, next: NextFunction) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2022-11-15' })
        // const session = await stripe.paymentIntents.retrieve(paymentIntent)
        const charge = await stripe.charges.retrieve(req.params.id)
        const data = await axios.get(charge.receipt_url || '')

        if (!charge) return res.status(404).json({ statusCode: 404, message: 'No charge found', charge })
        return res.status(200).json({ statusCode: 200, message: 'Success', charge, data: data.data })
    }
    public static getRawCheckoutSessionFromStripe = async (req: Request, res: Response, next: NextFunction) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2022-11-15' })
        // const session = await stripe.paymentIntents.retrieve(paymentIntent)
        const checkoutSession = await stripe.checkout.sessions.retrieve(req.params.id)
        console.log('id' + req.params.id)
        console.log(checkoutSession)
        if (!checkoutSession)
            return res.status(404).json({ statusCode: 404, message: 'No checkout session found', charge: checkoutSession })
        return res.status(200).json({ statusCode: 200, message: 'Success', checkoutSession })
    }
}
