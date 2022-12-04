import mongoose, { Schema } from 'mongoose'
import * as bcrypt from 'bcrypt'

export interface IUser {
    firstName: string
    lastName: string
    displayName: string
    email: string
    password: string
    isVerified: boolean
    confirmationCode: string
    admin: boolean
    correctPassword(candidatePassword: string, userPassword: string): boolean
}

const UserSchema: Schema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        displayName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        isVerified: {
            type: Boolean,
            default: false,
        },
        confirmationCode: { type: String, unique: true },
        admin: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)
UserSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

export default mongoose.model<IUser>('User', UserSchema)
