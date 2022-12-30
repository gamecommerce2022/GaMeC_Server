import Stripe from 'stripe'
import express, { Express } from 'express'

import env from 'dotenv'
import ShoppingController from '../../domain_product/shopping/controller'
import mongooseLoader from './mongoose.loader'

// export = (app: Express) => {
//     env.config()

//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//         apiVersion: '2022-11-15',
//     })

//     const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET as string

//     // Use JSON parser for all non-webhook routes
//     app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
//         if (req.originalUrl === '/webhook') {
//             next()
//         } else {
//             express.json()(req, res, next)
//         }
//     })

//     app.post(
//         '/webhook',
//         // Stripe requires the raw body to construct the event
//         express.raw({ type: 'application/json' }),
//         async (req: express.Request, res: express.Response) => {
//             const sig = req.headers['stripe-signature'] as string

//             let event: Stripe.Event

//             try {
//                 event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
//             } catch (err: any) {
//                 // On error, log and return the error message
//                 console.log(`❌ Error message: ${err.message}`)
//                 res.status(400).send(`Webhook Error: ${err.message}`)
//                 return
//             }
//             const json = JSON.parse(JSON.stringify(event.data.object))
//             console.log('id: ' + json.id)
//             // Successfully constructed event
//             // console.log('✅ Success:', event.id)
//             // console.log('event' + JSON.stringify(event))

//             // Cast event data to Stripe object
//             if (event.type === 'checkout_session.completed') {
//                 await ShoppingController.updateBillingStatus(json.id, 'success')
//             } else if (event.type === 'charge.succeeded') {
//                 await ShoppingController.updateBillingStatus(json.id, 'success')
//             }
//             // if (event.type === 'payment_intent.succeeded') {
//             //     const stripeObject: Stripe.PaymentIntent = event.data.object as Stripe.PaymentIntent
//             //     // console.log(`💰 PaymentIntent status: ${JSON.stringify(stripeObject)}`)
//             //     ShoppingController.updateBillingStatus(stripeObject.id, 'failed')
//             // } else if (event.type === 'charge.succeeded') {
//             //     const charge = event.data.object as Stripe.Charge

//             //     // console.log('charge' + JSON.stringify(charge))
//             // }
//             else {
//                 console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`)
//             }

//             // Return a response to acknowledge receipt of the event
//             res.json({ received: true })
//         }
//     )
// }
export = (app: Express) => {
    // env.config()
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: '2022-11-15',
    })

    const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET as string

    // const app = express()

    // Use JSON parser for all non-webhook routes
    app.use((req, res, next) => {
        if (req.originalUrl === '/webhook') {
            next()
        } else {
            express.json()(req, res, next)
        }
    })

    // Stripe requires the raw body to construct the event
    app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
        const sig = req.headers['stripe-signature']

        let event

        try {
            event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret)
        } catch (err: any) {
            // On error, log and return the error message
            console.log(`❌ Error message: ${err.message}`)
            return res.status(400).send(`Webhook Error: ${err.message}`)
        }

        // Successfully constructed event
        console.log('✅ Success:', event.id)

        // Return a response to acknowledge receipt of the event
        res.json({ received: true })
    })
}
