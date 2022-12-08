import Joi from 'joi'
import * as Product from './model'

export const Schemas = {
    product: {
        create: Joi.object<Product.IProduct>({

        }),
        update: Joi.object<Product.IProduct>({

        }),
    },
}
