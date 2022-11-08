import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
    genre: string
    image: string
    description: string
}

const CategorySchema: Schema = new Schema({
    genre: { type: String, required: 'Please enter the genre' },
    image: { type: String },
    description: { type: String },
})

// Export the model and return your ICategory interface
export default mongoose.model<ICategory>('Category', CategorySchema)
