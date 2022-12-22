import mongoose, { Document, Schema } from 'mongoose'

export interface IProfile {
    slogan: string
    description: string
}

export interface IProfileModel extends IProfile, Document { }

const IProfileSchema = new Schema({
    slogan: { type: String, required: false },
    description: { type: String, required: false },
}, {
    timestamps: true,
    versionKey: false,
})

export default mongoose.model<IProfile>('Profile', IProfileSchema)