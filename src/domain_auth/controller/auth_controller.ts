import { NextFunction, Request, Response } from 'express'
import { User } from '@app/domain_user/model'
import * as bcrypt from 'bcrypt'
export default class AuthController {
    public static register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashed = await bcrypt.hash(req.body.password, salt)
            //Create new user
            const newUser = new User.default({
                name: req.body.name,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                displayName: req.body.displayName,
                email: req.body.email,
                password: hashed,
            })
            const user = await newUser.save()
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}
