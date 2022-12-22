/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import mongoose from "mongoose"
import * as Report from './model'

export default class ReportController {
    public static create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                userName, address, phoneNumber, email, description
            } = req.body
            const report = new Report.default({
                _id: new mongoose.Types.ObjectId(),
                userName, address, phoneNumber, email, description,
            })
            const reportResult = await report.save()
            return res.status(200).json({
                code: 200, report: reportResult
            })
        } catch (error) {
            return res.status(500).json({ code: 500, error })
        }
    }

    public static getByPage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                page, perPage
            } = req.query


            const reportList = await Report.default.find().skip(parseInt((page as string) || '0') * parseInt((perPage as string) || '0')).limit(parseInt((perPage as string) || '0'))
            return res.status(200).json({ code: 200, reports: reportList })
        } catch (error) {
            return res.status(500).json({ code: 500, error })
        }
    }

    public static getLength = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const length = await Report.default.find().count()
            if (length) {
                return res.status(200).json({ code: 200, length })
            } else {
                return res.status(400).json({ code: 400, message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ code: 500, message: error })
        }
    }
}