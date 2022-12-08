import mongoose, { Document, Schema } from 'mongoose'

export interface INews {
    title: string
    author: string | null
    date: Date | null
    category: string | null
    mainImage: string | null
    description: string[] | null
    shortDescription: string | null
}

export interface INewsModel extends INews, Document { }

const INewsSchema: Schema = new Schema(
    {
        title: { type: String, require: true },
        author: { type: String, require: false },
        date: { type: Date, require: false },
        category: { type: String, require: false },
        mainImage: { type: String, require: false },
        description: { type: [String], require: false },
        shortDescription: { type: String, require: false },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

export default mongoose.model<INewsModel>('News', INewsSchema)