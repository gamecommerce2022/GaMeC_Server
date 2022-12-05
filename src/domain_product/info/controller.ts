/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import * as Product from './model'


export default class ProductController {
    /** ================================================= */
    public static create = async (req: Request, res: Response, next: NextFunction) => {
        const {
            title,
            type,
            releaseDate,
            platform,
            maxPlayer,
            total,
            status,
            price,
            shortDescription,
            discount,
            note,
            tags,
            imageList,
            description,
            videoList,
        } = req.body

        const product = new Product.default({
            _id: new mongoose.Types.ObjectId(),
            title,
            type,
            releaseDate,
            platform,
            maxPlayer,
            total,
            status,
            price,
            shortDescription,
            discount,
            note,
            tags,
            imageList,
            description,
            videoList,
        })

        try {
            const productResult = await product.save()
            return res.status(200).json({ id: productResult._id, code: 200, message: 'Create Sucess' })
        } catch (error) {
            return res.status(500).json({ code: 500, message: error })
        }
    }


    /** ================================================= */
    public static read = async (req: Request, res: Response, next: NextFunction) => {
        const productId = req.params.productId

        try {
            const product = await Product.default.findById(productId)
            if (product) {
                return res.status(200).json({ code: 200, product })
            } else {
                return res.status(404).json({ code: 404, message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ code: 500, error })
        }
    }

    /** ================================================= */
    public static readAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await Product.default.find()
            if (products) {
                return res.status(200).json({ code: 200, products })
            } else {
                return res.status(400).json({ code: 400, message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ code: 500, message: error })
        }
    }

    /** ================================================= */
    public static readByPage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let pageNumber = 0
            if (req.query.page) {
                pageNumber = parseInt(req.query.page as string)
            }
            let pageLimit = 30
            if (req.query.perPage) {
                pageLimit = parseInt(req.query.perPage as string)
            }
            let q = ''
            if (req.query.q) {
                q = req.query.q as string
            }
            if (req.query.sort) {
                const typeSort = parseInt(req.query.sort as string)
                switch (typeSort) {
                    // By A - Z
                    case 1: {
                        const producList = await Product.default.find({ title: `${q}` }, {
                            _id: 1, title: 1, platform: 1, price: 1, type: 1, imageList: 1
                        }).sort({ title: 1 }).skip(pageNumber * pageLimit).limit(pageLimit)
                        return res.status(200).json({ code: 200, products: producList })
                    }
                    // By Z - A
                    case 2: {
                        const producList = await Product.default.find({ title: `${q}` }, {
                            _id: 1, title: 1, platform: 1, price: 1, type: 1, imageList: 1
                        }).sort({ title: -1 }).skip(pageNumber * pageLimit).limit(pageLimit)
                        return res.status(200).json({ code: 200, products: producList })
                    }
                    // By Price Low to High   
                    case 3: {
                        const producList = await Product.default.find({ title: `${q}` }, {
                            _id: 1, title: 1, platform: 1, price: 1, type: 1, imageList: 1
                        }).sort({ priceOffical: 1 }).skip(pageNumber * pageLimit).limit(pageLimit)
                        return res.status(200).json({ code: 200, products: producList })
                    }
                    // By Price High to Low
                    case 4: {
                        const producList = await Product.default.find({ title: `${q}` }, {
                            _id: 1, title: 1, platform: 1, price: 1, type: 1, imageList: 1
                        }).sort({ priceOffical: -1 }).skip(pageNumber * pageLimit).limit(pageLimit)
                        return res.status(200).json({ code: 200, products: producList })
                    }
                }

            }
            const producList = await Product.default.find({ title: `${q}` }, {
                _id: 1, title: 1, platform: 1, price: 1, type: 1, imageList: 1
            }).skip(pageNumber * pageLimit).limit(pageLimit)
            return res.status(200).json({ code: 200, products: producList })
        } catch (error) {
            return res.status(500).json({ code: 500, error })
        }
    }

    /** ================================================= */
    public static readPageNumber = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const queryText = req.query.q
            let query = {}
            if (queryText !== undefined) {
                query = { title: { $regex: `${queryText}` } }
                console.log(query)
            }
            const length = await Product.default.find(query).count()
            if (length) {
                return res.status(200).json({ code: 200, length })
            } else {
                return res.status(400).json({ code: 400, message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ code: 500, error })
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
                    return res.status(200).json({ code: 200, message: 'Update Product Success' })
                } catch (error) {
                    return res.status(501).json({ code: 501, message: error })
                }
            } else {
                return res.status(400).json({ code: 400, message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ code: 500, message: error })
        }
    }

    /** ================================================= */
    public static delete = async (req: Request, res: Response, next: NextFunction) => {
        const productId = req.params.productId

        try {
            const product = await Product.default.findByIdAndDelete(productId)
            if (product) {
                return res.status(200).json({ code: 200, message: 'Delete Success' })
            } else {
                return res.status(400).json({ code: 400, message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ code: 500, message: error })
        }
    }
}
