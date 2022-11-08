/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { Discount } from '../model'

export default class DiscountController {
    /** ================================================= */
    public static create = async (req: Request, res: Response, next: NextFunction) => {
        const { percentage, dateFrom, dateTo, description, image } = req.body

        const discount = new Discount.default({
            _id: new mongoose.Types.ObjectId(),
            percentage,
            dateFrom,
            dateTo,
            description,
            image,
        })

        try {
            const categoryResult = await discount.save()
            return res.status(200).json({ categoryResult })
        } catch (error) {
            return res.status(500).json({ error })
        }
    }

    /** ================================================= */
    public static read = async (req: Request, res: Response, next: NextFunction) => {
        const discountId = req.params.discountId

        try {
            const discount = await Discount.default.findById(discountId)
            if (discount) {
                return res.status(200).json({ discount })
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
            const discounts = await Discount.default.find()
            if (discounts) {
                return res.status(200).json({ discounts })
            } else {
                return res.status(400).json({ message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ error })
        }
    }

    /** ================================================= */
    public static update = async (req: Request, res: Response, next: NextFunction) => {
        const discountId = req.params.discountId

        try {
            const discount = await Discount.default.findById(discountId)
            if (discount) {
                discount.set(req.body)
                try {
                    await discount.save()
                    return res.status(200).json({ discount })
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
        const discountId = req.params.discountId

        try {
            const discount = await Discount.default.findByIdAndDelete(discountId)
            if (discount) {
                return res.status(200).json({ message: 'Delete Success' })
            } else {
                return res.status(400).json({ message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ error })
        }
    }
}
