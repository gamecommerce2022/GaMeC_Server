import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { User } from '../model'

const filterObj = (obj: any, ...allowedFields: string[]) => {
    Object.keys(obj).forEach((el) => {
        if (!allowedFields.includes(el)) {
            if (el != 'user') delete obj[el]
        }
    })

    return obj
}

export default class UserController {
    public static create = async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.body

        const user = new User.default({
            _id: new mongoose.Types.ObjectId(),
            name,
        })

        try {
            const userResult = await user.save()
            return res.status(200).json({ userResult })
        } catch (error) {
            return res.status(500).json({ error })
        }
    }

    public static read = async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId

        try {
            const user = await User.default.findById(userId)
            if (user) {
                return res.status(200).json({ user })
            } else {
                return res.status(400).json({ message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ error })
        }
    }

    public static readAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await User.default.find()
            if (users) {
                return res.status(200).json({ users })
            } else {
                return res.status(400).json({ message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ error })
        }
    }


    public static updateMe = async (req: Request, res: Response, next: NextFunction) => {
        //1) Create error if user POSTs password data
        if (req.body.password) {
            return next(
                res.status(400).json({
                    statusCode: 400,
                    message: 'This route is not for password updates. Please use /change-password',
                })
            )
        }
        //2) Filtered out unwanted fields name that are not allowed to be updated
        const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'displayName', 'email')

        //3) Update user documents
        const updatedUser = await User.default.findByIdAndUpdate(req.body.user.id, filteredBody, {
            new: true,
            runValidator: true,
        })
        // user!.lastName = 'Thinhdeptrai'
        // await user?.save()
        return res.status(200).json({ statusCode: 200, message: 'Success', user: updatedUser })
    }

    public static delete = async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId

        try {
            const user = await User.default.findByIdAndDelete(userId)
            if (user) {
                return res.status(200).json({
                    statusCode: 200,
                    message: 'Success',
                })
            } else {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'User not found',
                })
            }
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error,
            })
        }
    }
}
