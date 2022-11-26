import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct {
    title: string
    type: string[]
    releaseDate: string
    platform: string
    maxPlayer?: number
    total: number
    status?: string
    priceDefault: number
    priceDeposit?: number
    discount?: number
    priceOffical: number
    shortDescription?: string
    note?: string
    imageList?: string[]
    videoList?: string[]
    description: string
    comment: {
        name: string
        content: string
        date: string
    }[]
    like: number
    dislike: number
}

export interface IProductModel extends IProduct, Document {}

const IProductSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        type: [{ type: String, required: false }],
        releaseDate: { type: String, required: false },
        platform: { type: String, required: false },
        maxPlayer: { type: Number, required: false },
        total: { type: Number, required: false },
        status: { type: String, required: false },
        priceDefault: { type: Number, required: false },
        priceDeposit: { type: Number, required: false },
        discount: { type: Number, required: false },
        priceOffical: { type: Number, required: false },
        shortDescription: { type: String, required: false },
        note: { type: String, required: false },
        imageList: [{ type: String, required: false }],
        videoList: [{ type: String, required: false }],
        description: { type: String, required: false },
        comment: [
            {
                name: { type: String, required: true },
                content: { type: String, required: true },
                date: { type: String, required: true },
            },
        ],
        like: { type: Number, required: false },
        dislike: { type: Number, required: false },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

export default mongoose.model<IProductModel>('Product', IProductSchema)
