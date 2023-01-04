import { google } from 'googleapis'
import { Types } from 'mongoose'
import * as nodemailer from 'nodemailer'
import Stripe from 'stripe'
import { User } from '../domain_user/model'
import * as Shopping from '../domain_product/shopping/model'
import axios from 'axios'

export default class EmailUtil {
    public static sendInvoice = async (userId: string, shoppingId: string) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2022-11-15' })
        const user = await User.default.findById(userId)
        const shopping = await Shopping.default.findById(shoppingId)
        if (shopping == null) return
        const checkoutSession = await stripe.checkout.sessions.retrieve(shopping.stripeId)
        const paymentIntent = await stripe.paymentIntents.retrieve(checkoutSession.payment_intent as string)
        const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string)
        const data = await axios.get(charge.receipt_url || '')
        await EmailUtil.sendEmail('The GaMeC Team', user?.email || '', `Your GaMeC Receipt ${shopping.id} 💸`, data.data)
    }
    public static sendEmail = async (from: string, to: string, subject: string, html: string) => {
        const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
        oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })
        const accessToken = await oauth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_ADDRESS,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token || '',
            },
        })
        transport.sendMail({ from: from, to: to, subject: subject, html: html }, (err, info) => {
            console.log(info.envelope)
        })
    }
}
