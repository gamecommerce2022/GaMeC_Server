import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Image } from "../model";

export default class ImageController {
 public static create = async (req: Request, res: Response, next: NextFunction) => {
  const { images, videos } = req.body;

  const image = new Image.default(
   {
    _id: new mongoose.Types.ObjectId(),
    images, videos
   }
  );

  try {
   const imageResult = await image.save();
   return res.status(200).json({ imageResult });
  } catch (error) {
   return res.status(500).json({ error });
  }

 };

 public static read = async (req: Request, res: Response, next: NextFunction) => {

  const imageId = req.params.imageId;

  try {
   const image = await Image.default.findById(imageId);
   if (image) {
    return res.status(200).json({ image });
   } else {
    return res.status(400).json({ message: 'Not found' });
   }
  } catch (error) {
   return res.status(500).json({ error });
  }

 };

 public static readAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
   const images = await Image.default.find();
   if (images) {
    return res.status(200).json({ images });
   } else {
    return res.status(400).json({ message: 'Not found' });
   }
  } catch (error) {
   return res.status(500).json({ error });
  }
 };

 public static update = async (req: Request, res: Response, next: NextFunction) => {

  const imageId = req.params.imageId;

  try {
   const image = await Image.default.findById(imageId);
   if (image) {
    image.set(req.body);
    try {
     await image.save();
     return res.status(200).json({ image });
    } catch (error) {
     return res.status(501).json({ error });
    }
   } else {
    return res.status(400).json({ message: 'Not found' });
   }
  } catch (error) {
   return res.status(500).json({ error });
  }


 };

 public static delete = async (req: Request, res: Response, next: NextFunction) => {
  const imageId = req.params.imageId;

  try {
   const image = await Image.default.findByIdAndDelete(imageId);
   if (image) {
    return res.status(200).json({ message: 'Delete Success' });
   } else {
    return res.status(400).json({ message: 'Not found' });
   }
  } catch (error) {
   return res.status(500).json({ error });
  }
 };
}
