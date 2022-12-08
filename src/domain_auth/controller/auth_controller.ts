import { NextFunction, Request, response, Response } from 'express'
import { User } from '../../domain_user/model'
import * as bcrypt from 'bcrypt'
import { google } from 'googleapis'
import { AuthenticationUtil } from '../utils/email_verification_util'
import * as nodemailer from 'nodemailer'
import * as jwt from 'jsonwebtoken'
import { IUser } from '../../domain_user/model/user_model'

const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN as jwt.Secret, {
        expiresIn: process.env.LOGIN_EXPIRATION_TIME as string,
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
        let accessToken = null
        try {
            const userWithRequestedEmail = await User.default.findOne({ email: req.body.email })
            if (userWithRequestedEmail) {
                res.status(409).json({
                    statusCode: 409,
                    message: 'User existed',
                    accessToken,
                    data: {},
                })
                return
            }
            const salt = await bcrypt.genSalt(10)
            const hashed = await bcrypt.hash(req.body.password, salt)
            //Create new user
            const newUser = new User.default({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                displayName: req.body.displayName,
                email: req.body.email,
                password: hashed,
            })
            const user = await newUser.save()

            //token for auto login after signing up

            accessToken = signToken(user.id)

            //verify token for email verification
            const verifyToken = jwt.sign({}, process.env.JWT_ACCESS_TOKEN as jwt.Secret, {
                expiresIn: process.env.EMAIL_VERIFICATION_EXPIRATION_TIME as string,
            })

            AuthController.sendVerificationEmail(user.toObject(), verifyToken)
            res.status(200).json({
                statusCode: '200',
                message: 'Success',
                accessToken,
                data: {
                    user: user,
                },
            })
        } catch (error) {
            console.log(error)

            res.status(500).json({
                statusCode: '500',
                message: 'Internal Server Error',
                accessToken,
                data: {},
            })
        }
    }

    public static login = async (req: Request, res: Response) => {
        let accessToken = null
        try {
            const user = await User.default.findOne({ email: req.body.email }).select('+password')
            if (!user) {
                return res.status(404).json({ statusCode: 404, message: 'User not found', accessToken })
            }
            const correct = await user?.correctPassword(req.body.password, user?.password ?? '')
            if (!correct) {
                return res.status(401).json({ statusCode: 401, message: 'Wrong password', accessToken })
            }
            if (user && correct) {
                //Should not get password property as bad guy somehow can decode the hashed password
                const { password, ...others } = user.toObject()

                accessToken = signToken(user.id)
                return res.status(200).json({ statusCode: 200, message: 'Success', accessToken })
            }
        } catch (error) {
            console.log(error)

            return res.status(500).json({ statusCode: 500, message: 'Internal server error', accessToken })
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

    public static sendVerificationEmail = async (user: IUser, token: string) => {
        const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
        oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })
        const accessToken = await oauth2Client.getAccessToken()


        const transport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_ADDRESS,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token || '',
            },
        })
        transport.sendMail(
            {
                from: 'The GaMeC Team',
                to: user.email,
                subject: "Let's get you verified 🎮",
                html: AuthenticationUtil.getHtmlMessage(user, token),
            },
            (err, info) => {
                console.log(info.envelope)
            }
        )
    }

    public static forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        // 1) Get user based on POSTed email
        const user = await User.default.findOne({ email: req.body.email })

        if (!user) {
            next(res.status(404).json({ statusCode: 404, message: 'There is no user with that email address' }))
        }

        // 2) Generate the random reset token
        const resetToken = user?.createPasswordResetToken()

        await user?.save({ validateBeforeSave: false })
        // 3) Send it to user's email
    }
    public static resetPassword = (req: Request, res: Response, next: NextFunction) => {
        console.log('')
    }
}
