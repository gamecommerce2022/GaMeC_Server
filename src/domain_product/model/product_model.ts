import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct {
    title: string;
    type: string[];
    releaseDate: string;
    platform: string;
    maxPlayer?: number;
    total: number;
    status: string;
    priceDefault: number;
    priceOffical: number;
    shortDescription: string;
    discount?: number;
    note?: string;
    tags?: string[];
    imageList: string[];
    description: string[];
    videoList?: string[];
    rate: number;
    comment?: {
        name: string;
        content: string;
        date: string;
    }[];
    like?: number;
    dislike?: number;
}

export interface IProductModel extends IProduct, Document { }

const IProductSchema: Schema = new Schema(
    {
        title: String,
        type: [String],
        releaseDate: String,
        platform: String,
        maxPlayer: Number,
        total: Number,
        status: String,
        priceDefault: Number,
        priceOffical: Number,
        shortDescription: String,
        discount: Number,
        note: String,
        tags: [String],
        imageList: [String],
        description: [String],
        videoList: [String],
        rate: Number,
        comment: [{
            name: String,
            content: String,
            date: String,
        }],
        like: Number,
        dislike: Number,
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

export default mongoose.model<IProductModel>('Product', IProductSchema)
