import mongoose, { Document, Schema } from 'mongoose'

export interface IUser {
    firstName: string
    lastName: string
    displayName: string
    email: string
    password: string
    admin: boolean
}


const UserSchema: Schema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        displayName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        admin: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

export default mongoose.model<IUser>('User', UserSchema)
