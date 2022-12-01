/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import AWS from 'aws-sdk'
import { Product } from '../model'
import env from '../../library/configs/env'
import { ManagedUpload } from 'aws-sdk/clients/s3'
import { v4 as uuid } from 'uuid'

const s3 = new AWS.S3({
    accessKeyId: env.aws.idKey,
    secretAccessKey: env.aws.secretKey,
})

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
            priceDefault,
            priceOffical,
            shortDescription,
            discount,
            note,
            tags,
            imageList,
            description,
            videoList,
            rate,
            comment,
            like,
            dislike,
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
            priceDefault,
            priceOffical,
            shortDescription,
            discount,
            note,
            tags,
            imageList,
            description,
            videoList,
            rate,
            comment,
            like,
            dislike,
        })

        try {
            const productResult = await product.save()
            return res.status(200).json({ id: productResult._id, code: 200, message: 'Create Sucess' })
        } catch (error) {
            return res.status(500).json({ code: 500, message: error })
        }
    }

    public static updateImage = async (req: Request, res: Response) => {
        const id = req.body.id
        console.log(id)
        const myFile: string[] = req.file!.originalname.split('.')
        const fileType = myFile[myFile.length - 1]

        const params = {
            Bucket: env.aws.bucketName,
            Key: `${uuid()}.${fileType}`,
            Body: req.file!.buffer,
        }

        s3.upload(params, async (error: Error, data: ManagedUpload.SendData) => {
            if (error) {
                return res.status(500).json({ code: 500, message: error })
            } else {
                console.log(data)
                const product = await Product.default.findById(id)
                if (product) {
                    const imageList = product.imageList
                    imageList?.push(data.Location)
                    product.set(imageList)
                    await product.save()
                    console.log(product)
                    return res.status(200).json({ code: 200, message: 'Upload image success' })
                }
            }
        })
    }

    /** ================================================= */
    public static read = async (req: Request, res: Response, next: NextFunction) => {
        const productId = req.params.productId

        try {
            const product = await Product.default.findById(productId)
            if (product) {
                return res.status(200).json({ code: 200, product })
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
            const strPage = req.query.page
            let page = 0
            if (strPage !== undefined) {
                page = parseInt(strPage as string)
            }
            const strPerPage = req.query.perPage
            let perPage = 30
            if (strPerPage !== undefined) {
                perPage = parseInt(strPerPage as string)
            }

            const strSort = req.query.sort
            const strOrder = req.query.order
            let sort = {}
            if (strSort !== undefined && strOrder !== undefined) {
                if ((strOrder as string).includes('ASC')) {
                    sort = { [strSort as string]: 1 }
                } else {
                    sort = { [strSort as string]: -1 }
                }
            }

            const queryText = req.query.q
            let query = {}
            if (queryText !== undefined) {
                query = { title: { $regex: `${queryText}` } }
                console.log(query)
            }
            const products = await Product.default
                .find(query, {
                    _id: 1,
                    title: 1, priceDefault: 1, priceOffical: 1, platform: 1, imageList: 1
                }
                ).sort(sort).skip(page * perPage).limit(perPage);
            if (products) {
                return res.status(200).json({ code: 200, products });
            } else {
                return res.status(400).json({ code: 400, message: 'Not found' })
            }
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
