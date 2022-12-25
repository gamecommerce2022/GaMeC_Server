import { NextFunction, Request, Response } from 'express'
import { User } from '../../domain_user/model'
import * as bcrypt from 'bcrypt'
import { Auth, google } from 'googleapis'
import { AuthenticationUtil } from '../utils/email_verification_util'
import * as nodemailer from 'nodemailer'
import * as crypto from 'crypto'

import * as jwt from 'jsonwebtoken'
import { IUser } from '../../domain_user/model/user_model'
import EmailUtil from '../../utils/email'
import { Types } from 'mongoose'
const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN as jwt.Secret, {
        expiresIn: process.env.LOGIN_EXPIRATION_TIME as string,
    })
}

const createSendToken = (user: any, statusCode: number, res: Response) => {
    const accessToken = signToken(user.id)

    return res.status(statusCode).json({
        statusCode: statusCode,
        message: 'Success',
        accessToken,
        data: {
            user: user,
        },
    })
}

export default class AuthController {
    public static restrictTo = (...roles: string[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            //roles = ['admin','lead-guide']
            if (!roles.includes(req.body.user.role)) {
                return next(
                    res.status(403).json({
                        statusCode: 403,
                        message: 'Permission denied',
                    })
                )
            }
            next()
        }
    }

    public static protect = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let token
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1]
            }

            // 2) Verification Token
            if (!token) {
                return next(res.status(401).json({ statusCode: 401, message: 'Unauthorized' }))
            }
            const decoded = (await jwt.verify(token, process.env.JWT_ACCESS_TOKEN as jwt.Secret)) as jwt.JwtPayload

            // 3) Check if the user still exists
            const currentUser = await User.default.findById(decoded.id)

            if (!currentUser) {
                return next(
                    res.status(401).json({ statusCode: 401, message: 'The token belonging to this user no longer exist' })
                )
            }

            // 4) Check if the user changed password after token was issued
            if (currentUser.changePasswordAfter(decoded.iat)) {
                return next(
                    res.status(401).json({ statusCode: 401, message: 'User recently changed password, Please login again' })
                )
            }
            //grant access to protected route
            req.body.user = currentUser
            next()
        } catch (error: any) {
            console.log(error)

            return res.status(401).json({ statusCode: 401, message: error.message })
        }
        // 1) Getting token and check of it's there
    }
    public static register = async (req: Request, res: Response) => {
        try {
            const userWithRequestedEmail = await User.default.findOne({ email: req.body.email })
            if (userWithRequestedEmail) {
                res.status(409).json({
                    statusCode: 409,
                    message: 'User existed',
                    accessToken: null,
                    data: {},
                })
                return
            }
            const salt = await bcrypt.genSalt(12)
            const hashed = await bcrypt.hash(req.body.password, salt)
            //Create new user
            const newUser = await User.default.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                displayName: req.body.displayName,
                email: req.body.email,
                password: hashed,
            })
            // const user = await newUser.save()

            //token for auto login after signing up

            //verify token for email verification
            const verifyToken = jwt.sign({}, process.env.JWT_ACCESS_TOKEN as jwt.Secret, {
                expiresIn: process.env.EMAIL_VERIFICATION_EXPIRATION_TIME as string,
            })

            AuthController.sendVerificationEmail(newUser.toObject(), verifyToken)
            return createSendToken(newUser, 201, res)
        } catch (error) {
            console.log(error)

            res.status(500).json({
                statusCode: '500',
                message: 'Internal Server Error',
                accessToken: null,
                data: {},
            })
        }
    }

    public static login = async (req: Request, res: Response) => {
        try {
            const user = await User.default.findOne({ email: req.body.email }).select('+password')
            if (!user) {
                return res.status(404).json({ statusCode: 404, message: 'User not found', accessToken: null })
            }
            const correct = await user?.correctPassword(req.body.password, user?.password ?? '')
            if (!correct) {
                return res.status(401).json({ statusCode: 401, message: 'Wrong password', accessToken: null })
            }
            if (user && correct) {
                //Should not get password property as bad guy somehow can decode the hashed password
                const { password, ...others } = user.toObject()
                return createSendToken(user, 200, res)
            }
        } catch (error) {
            console.log(error)

            return res.status(500).json({ statusCode: 500, message: 'Internal server error', accessToken: null })
        }
    }

    public static verifyEmail = async (req: Request, res: Response) => {
        try {
            const verifyToken = req.params.token
            const email = req.params.email
            const decode = jwt.verify(verifyToken, process.env.JWT_ACCESS_TOKEN as jwt.Secret)
            console.log('decode result' + decode)
            console.log('email is' + email)
            User.default
                .updateOne({ email: email }, { $set: { isVerified: true } })
                .then(() => console.log('User found and modified email token'))

            return res.json({ status: 'okay' })
        } catch (error) {
            console.log(error)
            return res.json({ status: 'error' })
        }
    }

    public static forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        // 1) Get user based on POSTed email
        const user = await User.default.findOne({ email: req.body.email })

        if (!user) {
            return next(res.status(404).json({ statusCode: 404, message: 'There is no user with that email address' }))
        }

        // 2) Generate the random reset token
        const resetToken = user?.createPasswordResetToken()

        await user?.save({ validateBeforeSave: false })

        // 3) Send it to user's email
        try {
            await AuthController.sendResetEmail(user.toObject(), resetToken)

            return res.status(200).json({ statusCode: 200, message: 'Token sent to email' })
        } catch (error) {
            user.passwordResetToken = undefined
            user.passwordResetExpires = undefined
            await user.save({ validateBeforeSave: false })

            return next(
                res
                    .status(500)
                    .json({ status: 500, message: 'There was an error sending the email, please try again later' })
            )
        }
    }
    public static resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        // 1) Get user based on the token
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

        const user = await User.default.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        })

        // 2) If token has not expired, and there is user, set the new password
        if (!user) {
            return next(res.status(400).json({ statusCode: 400, message: 'Token is invalid or has expired' }))
        }
        user.password = req.body.password

        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined

        await user.save()
        // 3) Update the changedPasswordAt property for the user
        // 4) Log the user in, send JWT
        return createSendToken(user, 200, res)
    }

    public static updatePassword = async (req: Request, res: Response, next: NextFunction) => {
        //1. Get the user from the collection
        const user = await User.default.findById(req.body.user.id).select('+password')
        //2. Check if POSTed current password is correct
        if (!(await user?.correctPassword(req.body.currentPassword, user.password))) {
            return next(res.status(401).json({ statusCode: 401, message: 'Your current password is wrong' }))
        }
        //3. If the password is correct, update the password
        user!.password = req.body.newPassword
        await user?.save()
        //4. Log the user in, send JWT
        return createSendToken(user, 200, res)
    }

    public static sendVerificationEmail = async (user: IUser, token: string) => {
        await EmailUtil.sendEmail(
            'The GaMeC Team',
            user.email,
            "Let's get you verified 🎮",
            AuthenticationUtil.getVerificationMessage(user, token)
        )
    }
    public static sendResetEmail = async (user: IUser, resetToken: string) => {
        await EmailUtil.sendEmail(
            'The GaMeC Team',
            user.email,
            "Let's get you back to the game 🤘",
            AuthenticationUtil.getForgetPasswordMessage(resetToken)
        )
    }
}
