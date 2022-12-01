import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import morgan from 'morgan'

import env from '../configs/env'
import { routeConfig } from '../../config/routes'

export = () => {
    const app = express()

    // set log request
    app.use(morgan('dev'))

    // set security HTTP headers
    app.use(helmet())

    // parse json request body
    app.use(express.json())

    // parse urlencoded request body
    app.use(express.urlencoded({ extended: true }))

    // sanitize request data
    app.use(mongoSanitize())

    // gzip compression
    app.use(compression())

    // set cors blocked resources
    app.use(
        cors({
            exposedHeaders: ['Authorization'],
        })
    )
    app.options('*', cors())

    // api routes
    app.use(env.app.routePrefix, routeConfig.Brand.default)
    app.use(env.app.routePrefix, routeConfig.Category.default)
    app.use(env.app.routePrefix, routeConfig.Product.default)
    app.use(env.app.routePrefix, routeConfig.Discount.default)
    app.use(env.app.routePrefix, routeConfig.UserRoute.default)
    app.use(env.app.routePrefix, routeConfig.AuthRoute.default)

    // handle error

    app.listen(env.app.port)

    return app
}
