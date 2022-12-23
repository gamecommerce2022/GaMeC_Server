/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import mongoose from "mongoose"
import * as Profile from './info_model'

export default class ProfileController {

    public static get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const profile = await Profile.default.findOne()
            if (profile) {
                return res.status(200).json({ code: 200, profile })
            } else {
                return res.status(400).json({ code: 400, message: 'Not Found' })
            }
        } catch (error) {
            return res.status(500).json({ code: 500, message: error })
        }

    }

    public static create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                slogan, description
            } = req.body

            const profile = new Profile.default({
                _id: new mongoose.Types.ObjectId(),
                slogan, description,
            })
            const profileResult = await profile.save()
            return res.status(200).json({ code: 200, profile: profileResult })
        } catch (error) {
            return res.status(500).json({ code: 500, error })
        }
    }

    public static update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { profileId, slogan, description } = req.body
            if (profileId) {
                const profile = await Profile.default.findById(profileId as string)
                if (profile) {
                    profile.set({ slogan, description })
                    await profile.save()
                    return res.status(200).json({ code: 200, message: 'Update Success' })
                } else {
                    return res.status(400).json({ code: 400, message: 'Not Found' })
                }

            } else {
                return res.status(400).json({ code: 401, message: 'Not Found' })
            }

        } catch (error) {
            return res.status(500).json({ code: 500, error })
        }
    }
}