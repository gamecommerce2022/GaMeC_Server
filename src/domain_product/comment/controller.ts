/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import mongoose from "mongoose"
import * as Comment from './model'

export default class CommentController {
    public static create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                productId, authorId, authorName, content
            } = req.body
            const date = Date.now()
            const comment = new Comment.default({
                _id: new mongoose.Types.ObjectId(),
                productId, authorId, authorName, content, date,
            })
            const commentResult = await comment.save()
            return res.status(200).json({
                code: 200, comment: commentResult
            })
        } catch (error) {
            return res.status(500).json({ code: 500, error })
        }
    }

    /** ================================================= */

    public static like = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const commentId = req.params.commentId
            const comment = await Comment.default.findById(commentId)
            if (comment) {
                comment.like = comment?.like + 1;
                comment.set(comment)
                try {
                    await comment.save()
                    return res.status(200).json({ code: 200, message: 'Update Comment Success' })
                } catch (error) {
                    return res.status(501).json({ code: 501, message: error })
                }
            } else {
                return res.status(400).json({ code: 400, message: 'Not found' })
            }

        } catch (error) {
            return res.status(500).json({ code: 500, error })
        }
    }

    /** ================================================= */

    public static getCommentsByProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId = req.params.productId
            const comments = await Comment.default.find({ productId: productId })
            return res.status(200).json({ code: 200, comments })
        } catch (error) {
            return res.status(500).json({ code: 500, error })
        }
    }

    /** ================================================= */

    public static getCommentsByUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.userId
            const comments = await Comment.default.find({ authorId: userId })
            return res.status(200).json({ code: 200, comments })
        } catch (error) {
            return res.status(500).json({ code: 500, error })
        }
    }
}