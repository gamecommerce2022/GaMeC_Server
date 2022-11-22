import { NextFunction, Request, Response } from 'express'
import { User } from '../../domain_user/model'
import * as bcrypt from 'bcrypt'
import { google } from 'googleapis'
import { AuthenticationUtil } from '../utils/email_verification_util'
export default class AuthController {
    public static register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userWithRequestedEmail = await User.default.findOne({ email: req.body.email })
            if (userWithRequestedEmail) {
                res.status(409).json('Email existed')
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
            AuthenticationUtil.sendVerificationEmail(user.email)
            res.status(200).json(user)
        } catch (error) {
            console.log(error)

            res.status(500).json(error)
        }
    }

    public static login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await User.default.findOne({ email: req.body.email })
            if (!user) {
                res.status(404).json('Wrong username!')
            }
            const validPassword = await bcrypt.compare(req.body.password, user?.password ?? '')
            if (!validPassword) {
                res.status(404).json('Wrong password')
            }
            if (user && validPassword) {
                res.status(200).json(user)
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    public static sendVerificationEmail = async (req: Request, res: Response) => {
        const OAuth2 = google.auth.OAuth2
    }
}
