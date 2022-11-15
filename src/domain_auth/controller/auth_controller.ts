import { Request, Response } from 'express'
import { User } from '../../domain_user/model'
import * as bcrypt from 'bcrypt'

import { LoginStatusCode, SignUpStatusCode } from '../utils/auth_status_code'
import { AuthenticationUtil } from '../utils/email_verification_util'
export default class AuthController {
    public static register = async (req: Request, res: Response) => {
        try {
            const userWithRequestedEmail = await User.default.findOne({ email: req.body.email })
            if (userWithRequestedEmail) {
                return res.status(SignUpStatusCode.EMAIL_EXISTED).json('Email existed')
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
            AuthenticationUtil.sendVerificationEmail("thinhnd@unicloud.com.vn")
            return res.status(SignUpStatusCode.SUCCESS).json(user)
        } catch (error) {
            return res.status(SignUpStatusCode.INTERNAL_SERVER_ERROR).json(error)
        }
    }

    public static login = async (req: Request, res: Response) => {
        try {
            const user = await User.default.findOne({ email: req.body.email })
            if (user?.status != 'Active') {
                return res
                    .status(LoginStatusCode.EMAIL_INACTIVE)
                    .json({ message: 'Pending account. Please verify your email!,' })
            }
            if (!user) {
                return res.status(LoginStatusCode.UNAUTHORIZED).json('Wrong username!')
            }
            const validPassword = await bcrypt.compare(req.body.password, user?.password ?? '')
            if (!validPassword) {
                return res.status(LoginStatusCode.UNAUTHORIZED).json('Wrong password')
            }
            if (user && validPassword) {
                return res.status(LoginStatusCode.SUCCESS).json(user)
            }
        } catch (error) {
            return res.status(LoginStatusCode.INTERNAL_SERVER_ERROR).json(error)
        }
    }
}
