import mongoose from 'mongoose'

import env from '../configs/env'
import Logging from '../logging'

export = async () => {
    mongoose
        .connect(env.database.connection || '', { retryWrites: true, w: 'majority' })
        .then(() => {
            Logging.info('Connect to Mongo Database')
        })
        .catch((err) => {
            Logging.error('Unable to connect Mongo Database')
            Logging.error(err)
        })
}
