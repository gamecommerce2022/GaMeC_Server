import mongoose, { Schema } from 'mongoose'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
export interface IUser {
    firstName: string
    lastName: string
    displayName: string
    email: string
    password: string
    isVerified: boolean
    role: string
    passwordChangedAt: Date
    passwordResetToken: string
    passwordResetExpires: Date
    correctPassword(candidatePassword: string, userPassword: string): boolean
    changePasswordAfter(jwtTimeStamp: any): boolean
    createPasswordResetToken(): string
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
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        passwordChangedAt: { type: Date, default: Date.now() },
        passwordResetToken: { type: String },
        passwordResetExpires: { type: Date },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)
UserSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

UserSchema.methods.changePasswordAfter = function (jwtTimeStamp: any) {
    if (this.passwordChangedAt) {
        const changedTimeStampInSecond = this.passwordChangedAt.getTime() / 1000 //Convert from millisecond into second
        const changedTimeStamp = parseInt(changedTimeStampInSecond.toString(), 10)
        return jwtTimeStamp < changedTimeStamp // changed the password after the token was issued
    }
    return false
}
UserSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('base64')

    console.log({ resetToken }, this.passwordResetToken)

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}
export default mongoose.model<IUser>('User', UserSchema)
