import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct {
    title: string
    type: string[]
    releaseDate: string
    platform: string
    maxPlayer?: number
    total: number
    status: string
    price: number
    shortDescription: string
    discount?: number
    note?: string
    tags?: string[]
    imageList: string[]
    description: string
    videoList?: string[]
    countBuy: number
}

export interface IProductModel extends IProduct, Document { }

const IProductSchema: Schema = new Schema(
    {
        title: {
            type: String, require: true
        },
        type: {
            type: [String], require: true
        },
        releaseDate: {
            type: String, require: true
        },
        platform: {
            type: String, require: true
        },
        maxPlayer: {
            type: Number, require: false, default: 1,
        },
        total: {
            type: Number, require: true, default: 0,
        },
        status: {
            type: String, require: true, default: 'AVAILABLE'
        },
        price: {
            type: Number, required: true, default: 0.0
        },
        shortDescription: {
            type: String, require: true
        },
        discount: {
            type: Number, require: false, default: 0.0
        },
        note: {
            type: String, require: false
        },
        tags: {
            type: [String], require: false
        },
        imageList: {
            type: [String], require: true
        },
        description: {
            type: String, require: true
        },
        videoList: {
            type: [String], require: false
        },
        countBuy: {
            type: Number, require: false, default: 0
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

export default mongoose.model<IProductModel>('Product', IProductSchema)
