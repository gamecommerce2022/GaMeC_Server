import mongoose, { Schema, Document } from 'mongoose'

export interface IBrand extends Document {
    name: string
    image: string
    description: string
    total: number
}

const BrandSchema: Schema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: false },
    description: { type: String, required: false },
    total: { type: Number, required: false },
})

// Export the model and return your IBrand interface
export default mongoose.model<IBrand>('Brand', BrandSchema)
