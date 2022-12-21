import { NextFunction, Request, Response } from 'express'
import { User } from '../../domain_user/model'

export default class ShoppingController {
    public static addToFavorites = async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.default.findById(req.body.user.id)

        if (!user) return next(res.status(401).json({ statusCode: 401, message: 'Unauthorized' }))
        if (user.favorites.includes(req.body.productId))
            return res.status(409).json({ statusCode: 409, message: 'Item already existed' })
        user.addToFavorites(req.body.productId)
        await user.save({ validateBeforeSave: false })
        return next(res.status(200).json({ statusCode: 200, message: 'Success' }))
    }
    public static removeFromFavorites = async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.default.findById(req.body.user.id)

        if (!user) return next(res.status(401).json({ statusCode: 401, message: 'Unauthorized' }))

        if (!user.favorites.includes(req.body.productId))
            return res.status(404).json({ statusCode: 404, message: 'Item not found is list' })

        user.removeFromFavorites(req.body.productId)
        await user.save({ validateBeforeSave: false })
        return next(res.status(200).json({ statusCode: 200, message: 'Success' }))
    }
    public static getFavorites = async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.default.findById(req.body.user.id)
        if (!user) return next(res.status(401).json({ statusCode: 401, message: 'Unauthorized', data: null }))

        return next(res.status(200).json({ statusCode: 200, message: 'Success', data: user.toObject().favorites }))
    }
}
