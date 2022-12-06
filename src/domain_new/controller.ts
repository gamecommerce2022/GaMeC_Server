/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import * as News from './model'
import mongoose from 'mongoose'

export default class NewsController {
    public static create = async (req: Request, res: Response, next: NextFunction) => {
        const {
            title,
            author,
            date,
            category,
            shortDescription,
            mainImage,
            description,
        } = req.body
        const news = new News.default({
            _id: new mongoose.Types.ObjectId(),
            title,
            author,
            date,
            category,
            shortDescription,
            mainImage,
            description,
        })

        try {
            const newsResult = await news.save()
            return res.status(200).json({
                id: newsResult._id, code: 200, message: 'Create Success'
            })
        } catch (error) {
            return res.status(500).json({ code: 500, message: error })
        }
    }

    /** ================================================= */

    public static read = async (req: Request, res: Response, next: NextFunction) => {
        const newsId = req.params.newsId

        try {
            const news = await News.default.findById(newsId)
            if (news) {
                return res.status(200).json({ code: 200, news })
            } else {
                return res.status(404).json({ code: 404, message: 'Not Found' })
            }
        } catch (error) {
            return res.status(500).json({ code: 500, error })
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
                        const newsList = await News.default.find(q === '' ? {} : { title: { $regex: `${q}` } }, {
                            _id: 1, title: 1, category: 1, author: 1, date: 1,
                        }).sort({ title: 1 }).skip(pageNumber * pageLimit).limit(pageLimit)
                        return res.status(200).json({ code: 200, newsList: newsList })
                    }
                    // By Z - A
                    case 2: {
                        const newsList = await News.default.find(q === '' ? {} : { title: { $regex: `${q}` } }, {
                            _id: 1, title: 1, category: 1, author: 1, date: 1,
                        }).sort({ title: -1 }).skip(pageNumber * pageLimit).limit(pageLimit)
                        return res.status(200).json({ code: 200, newsList: newsList })
                    }
                    // By Date Old to New
                    case 3: {
                        const newsList = await News.default.find(q === '' ? {} : { title: { $regex: `${q}` } }, {
                            _id: 1, title: 1, category: 1, author: 1, date: 1,
                        }).sort({ date: 1 }).skip(pageNumber * pageLimit).limit(pageLimit)
                        return res.status(200).json({ code: 200, newsList: newsList })
                    }
                    // By Date New to Old
                    case 4: {
                        const newsList = await News.default.find(q === '' ? {} : { title: { $regex: `${q}` } }, {
                            _id: 1, title: 1, category: 1, author: 1, date: 1,
                        }).sort({ date: -1 }).skip(pageNumber * pageLimit).limit(pageLimit)
                        return res.status(200).json({ code: 200, newsList: newsList })
                    }
                }

            }
            const newsList = await News.default.find(q === '' ? {} : { title: { $regex: `${q}` } }, {
                _id: 1, title: 1, category: 1, author: 1, date: 1,
            }).skip(pageNumber * pageLimit).limit(pageLimit)
            return res.status(200).json({ code: 200, newsList: newsList })
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
            const length = await News.default.find(query).count()
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
        const newsId = req.params.newsId

        try {
            const news = await News.default.findById(newsId)
            if (news) {
                news.set(req.body)
                try {
                    await news.save()
                    return res.status(200).json({ code: 200, message: 'Update News Success' })
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
        const newsId = req.params.newsId

        try {
            const news = await News.default.findByIdAndDelete(newsId)
            if (news) {
                return res.status(200).json({ code: 200, message: 'Delete Success' })
            } else {
                return res.status(400).json({ code: 400, message: 'Not found' })
            }
        } catch (error) {
            return res.status(500).json({ code: 500, message: error })
        }
    }
}