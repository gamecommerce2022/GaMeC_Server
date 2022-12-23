import mongoose, { Document, Schema } from 'mongoose'

export interface IShopping {
    stripeId: string
    userId: string | null
    date: Date
    paymentStatus: string
    deliverStatus: string
    products: string[]
    total: number
}

export interface IShoppingModel extends IShopping, Document {}

const IShoppingSchema: Schema = new Schema(
    {
        stripeId: { type: String, require: true },
        userId: { type: String, require: false },
        date: { type: Date, require: false },
        paymentStatus: { type: String, require: true, default: 'pending' },
        deliverStatus: { type: String, required: true, default: 'waiting' },
        products: [{ type: String, require: true }],
        total: { type: Number, required: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

export default mongoose.model<IShoppingModel>('Shoppings', IShoppingSchema)
