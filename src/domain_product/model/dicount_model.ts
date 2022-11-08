import mongoose, { Document, Schema } from 'mongoose'

export interface IDiscount extends Document {
    percentage: number
    dateFrom: Date
    dateTo: Date
    description: string
    image: string
}

export const DiscountSchema: Schema = new Schema(
    {
        percentage: { type: Number, required: true },
        dateFrom: { type: Schema.Types.Date, required: false },
        dateTo: { type: Schema.Types.Date, required: false },
        description: { type: String, required: false },
        image: { type: String, required: false },
    },
    {
        versionKey: false,
    }
)

// Export the model and return your IDiscount interface
export default mongoose.model<IDiscount>('Discount', DiscountSchema)
