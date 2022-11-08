import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { User } from '../model'

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

    public static update = async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId

        try {
            const user = await User.default.findById(userId)
            if (user) {
                user.set(req.body)
                try {
                    await user.save()
                    return res.status(200).json({ user })
                } catch (error) {
                    return res.status(501).json({ error })
                }
            } else {
                return res.status(400).json({ message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ error })
        }
    }

    public static delete = async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId

        try {
            const user = await User.default.findByIdAndDelete(userId)
            if (user) {
                return res.status(200).json({ message: 'Delete Success' })
            } else {
                return res.status(400).json({ message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ error })
        }
    }
}
