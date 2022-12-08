
import { NextFunction, Request, Response } from "express";
import admin = require("firebase-admin");
import env from "../configs/env";

import firebaseAccountCredentials = require('../configs/firebase-key.json')

const serviceAccount = firebaseAccountCredentials as admin.ServiceAccount

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: env.firebase.storageBucket,
});

const bucket = admin.storage().bucket()

const uploadImage = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.file)
    if (!req.file) return next()

    const image = req.file
    const imageName = Date.now() + "." + image.originalname.split(".").pop()

    const file = bucket.file(imageName)
    const stream = file.createWriteStream({
        metadata: {
            contentType: image.mimetype
        },
    })

    stream.on("error", (e) => {
        console.log(e)
    })

    stream.on("finish", async () => {
        await file.makePublic()

        const imagePath = `https://storage.googleapis.com/${env.firebase.storageBucket}/${imageName}`
        res.status(200).json({ imagePath, code: 200 })

        next()
    })

    stream.end(image.buffer)
}

export = uploadImage
