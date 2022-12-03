import { Request, Response } from 'express'
import { User } from '../../domain_user/model'
import * as bcrypt from 'bcrypt'
import { google } from 'googleapis'
import { AuthenticationUtil } from '../utils/email_verification_util'
import * as nodemailer from 'nodemailer'
import * as jwt from 'jsonwebtoken'
import { IUser } from '../../domain_user/model/user_model'
export default class AuthController {
    public static register = async (req: Request, res: Response) => {
        try {
            const userWithRequestedEmail = await User.default.findOne({ email: req.body.email })
            if (userWithRequestedEmail) {
                res.status(409).json({
                    statusCode: '409',
                    message: 'Email existed',
                    token: '',
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
            const token = jwt.sign({ id: user.toObject()._id }, process.env.JWT_ACCESS_TOKEN as jwt.Secret, {
                expiresIn: process.env.LOGIN_EXPIRATION_TIME as string,
            })

            //verify token for email verification
            const verifyToken = jwt.sign({}, process.env.JWT_ACCESS_TOKEN as jwt.Secret, {
                expiresIn: process.env.EMAIL_VERIFICATION_EXPIRATION_TIME as string,
            })
            console.log(verifyToken)

            AuthController.sendVerificationEmail(user.toObject(), verifyToken)
            res.status(200).json({
                statusCode: '200',
                message: 'Success',
                token,
                data: {
                    user: user,
                },
            })
        } catch (error) {
            console.log(error)

            res.status(500).json({
                statusCode: '500',
                message: 'Internal Server Error',
                token: '',
                data: {},
            })
        }
    }

    public static login = async (req: Request, res: Response) => {
        try {
            const user = await User.default.findOne({ email: req.body.email })
            if (!user) {
                res.status(404).json('Wrong username!')
            }
            const validPassword = await bcrypt.compare(req.body.password, user?.password ?? '')
            if (!validPassword) {
                return res.status(404).json('Wrong password')
            }
            if (user && validPassword) {
                //Should not get password property as bad guy somehow can decode the hashed password
                const { password, ...others } = user.toObject()

                const accessToken = jwt.sign({ others }, process.env.JWT_ACCESS_TOKEN as jwt.Secret, { expiresIn: '1h' })
                return res.status(200).json({ ...others, accessToken })
            }
        } catch (error) {
            console.log(error)

            return res.status(500).json(error)
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
                .then((_) => console.log('User found and modified email token'))

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
            service: 'gmail',
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
}
