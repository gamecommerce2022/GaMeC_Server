/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { Catergory } from '../model'

export default class CategoryController {
    /** ================================================= */
    public static create = async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body)
        const { genre, image, description } = req.body

        const category = new Catergory.default({
            _id: new mongoose.Types.ObjectId(),
            genre,
            image,
            description,
        })

        try {
            const categoryResult = await category.save()
            return res.status(200).json({ categoryResult })
        } catch (error) {
            return res.status(500).json({ error })
        }
    }

    /** ================================================= */
    public static read = async (req: Request, res: Response, next: NextFunction) => {
        const categoryId = req.params.categoryId

        try {
            const category = await Catergory.default.findById(categoryId)
            if (category) {
                return res.status(200).json({ category })
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
            const categories = await Catergory.default.find()
            if (categories) {
                return res.status(200).json({ categories })
            } else {
                return res.status(400).json({ message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ error })
        }
    }

    /** ================================================= */
    public static update = async (req: Request, res: Response, next: NextFunction) => {
        const categoryId = req.params.categoryId

        try {
            const category = await Catergory.default.findById(categoryId)
            if (category) {
                category.set(req.body)
                try {
                    await category.save()
                    return res.status(200).json({ category })
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
        const categoryId = req.params.categoryId

        try {
            const category = await Catergory.default.findByIdAndDelete(categoryId)
            if (category) {
                return res.status(200).json({ message: 'Delete Success' })
            } else {
                return res.status(400).json({ message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ error })
        }
    }
}
