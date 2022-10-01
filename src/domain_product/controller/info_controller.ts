import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Info } from "../model";

export default class InfoController {
 public static create = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  const info = new Info.default(
   {
    _id: new mongoose.Types.ObjectId(),
    name
   }
  );

  try {
   const infoResult = await info.save();
   return res.status(200).json({ infoResult });
  } catch (error) {
   return res.status(500).json({ error });
  }

 };

 public static read = async (req: Request, res: Response, next: NextFunction) => {

  const infoId = req.params.infoId;

  try {
   const info = await Info.default.findById(infoId);
   if (info) {
    return res.status(200).json({ info });
   } else {
    return res.status(400).json({ message: 'Not found' });
   }
  } catch (error) {
   return res.status(500).json({ error });
  }

 };

 public static readAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
   const infos = await Info.default.find();
   if (infos) {
    return res.status(200).json({ infos });
   } else {
    return res.status(400).json({ message: 'Not found' });
   }
  } catch (error) {
   return res.status(500).json({ error });
  }
 };

 public static update = async (req: Request, res: Response, next: NextFunction) => {

  const infoId = req.params.infoId;

  try {
   const info = await Info.default.findById(infoId);
   if (info) {
    info.set(req.body);
    try {
     await info.save();
     return res.status(200).json({ info });
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
  const infoId = req.params.infoId;

  try {
   const info = await Info.default.findByIdAndDelete(infoId);
   if (info) {
    return res.status(200).json({ message: 'Delete Success' });
   } else {
    return res.status(400).json({ message: 'Not found' });
   }
  } catch (error) {
   return res.status(500).json({ error });
  }
 };
}
