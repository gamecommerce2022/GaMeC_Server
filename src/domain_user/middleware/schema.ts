import Joi from 'joi'
import { User } from '../controller'


export const Schemas = {
    user: {
        create: Joi.object<User.default>({
            displayName: Joi.string().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email(),
            password: Joi.string().required(),
            admin: Joi.bool().default(false),
        }),
        update: Joi.object<User.default>({
            displayName: Joi.string().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email(),
            password: Joi.string().required(),
            admin: Joi.bool().default(false),
        }),
    },
}
