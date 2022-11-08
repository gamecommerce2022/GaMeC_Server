import { Schema, Document } from 'mongoose'

export interface IImage extends Document {
    images: string[]
    videos: string[]
}
export const ImageSchema: Schema = new Schema({
    images: { type: Schema.Types.Array, required: false },
    videos: { type: Schema.Types.Array, required: false },
})
