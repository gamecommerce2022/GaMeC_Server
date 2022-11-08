/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { Product } from '../model'
import { IProduct } from '../model/product_model'

export default class ProductController {
    /** ================================================= */
    public static create = async (req: Request, res: Response, next: NextFunction) => {
        const {
            short_image,
            price_after,
            price_before,
            image_list,
            title,
            type,
            max_player,
            release_date,
            language,
            addition_info,
            description,
            addtion_images,
            videos,
            platform,
            rate,
            like,
            dislike,
            comment,
        } = req.body

        const product = new Product.default({
            _id: new mongoose.Types.ObjectId(),
            short_image,
            price_after,
            price_before,
            image_list,
            title,
            type,
            max_player,
            release_date,
            language,
            addition_info,
            description,
            addtion_images,
            videos,
            platform,
            rate,
            like,
            dislike,
            comment,
        })

        try {
            const productResult = await product.save()
            return res.status(200).json({ productResult })
        } catch (error) {
            return res.status(500).json({ error })
        }
    }

    /** ================================================= */
    public static read = async (req: Request, res: Response, next: NextFunction) => {
        const productId = req.params.productId

        try {
            const product = await Product.default.findById(productId)
            if (product) {
                return res.status(200).json({ product })
            } else {
                return res.status(400).json({ message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ error })
        }
    }

    /** ================================================= */
    public static readAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await Product.default.find()
            if (products) {
                return res.status(200).json({ products })
            } else {
                return res.status(400).json({ message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ error })
        }
    }

    /** ================================================= */
    public static readByPage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let page: string = req.query.p as string
            let limit: string = req.query.limit as string
            let platform: string = req.query.platform as string
            console.log(`${page} - ${limit} - ${platform}`)
            if (limit === undefined) {
                limit = '30'
            }
            if (page === undefined) {
                page = '0'
            }
            let products: IProduct[] = []
            if (platform === undefined) {
                platform = 'all'
                products = await Product.default
                    .find({}, { title: 1, price_before: 1, price_after: 1, platform: 1, short_image: 1 })
                    .skip(parseInt(page) * parseInt(limit))
                    .limit(parseInt(limit))
            } else {
                products = await Product.default
                    .find(
                        {},
                        { title: 1, price_before: 1, price_after: 1, platform: 1, short_image: 1 },
                        { platform: platform }
                    )
                    .skip(parseInt(page) * parseInt(limit))
                    .limit(parseInt(limit))
            }
            if (products) {
                return res.status(200).json({ products })
            } else {
                return res.status(400).json({ message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ error })
        }
    }

    /** ================================================= */
    public static readPageNumber = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const length = await Product.default.count()
            if (length) {
                return res.status(200).json({ length })
            } else {
                return res.status(400).json({ message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ error })
        }
    }

    /** ================================================= */
    public static update = async (req: Request, res: Response, next: NextFunction) => {
        const productId = req.params.productId

        try {
            const product = await Product.default.findById(productId)
            if (product) {
                product.set(req.body)
                try {
                    await product.save()
                    return res.status(200).json({ product })
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

    /** ================================================= */
    public static delete = async (req: Request, res: Response, next: NextFunction) => {
        const productId = req.params.productId

        try {
            const product = await Product.default.findByIdAndDelete(productId)
            if (product) {
                return res.status(200).json({ message: 'Delete Success' })
            } else {
                return res.status(400).json({ message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ error })
        }
    }
}
