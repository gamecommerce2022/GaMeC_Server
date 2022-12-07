import mongoose, { Document, Schema } from 'mongoose'

export interface IComment {
    idProduct: string
    authorId: string
    authorName: string
    content: string
    date: Date
    like: number
}

export interface ICommentModel extends IComment, Document { }

const ICommentSchema = new Schema({
    idProduct: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now() },
    like: { type: Number, required: false, default: 0 }
}, {
    timestamps: true,
    versionKey: false,
})

export default mongoose.model<IComment>('Comment', ICommentSchema)