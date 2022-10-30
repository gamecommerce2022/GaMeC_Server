/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Brand } from "../model";

export default class BrandController {
 /** ================================================= */
 public static create = async (req: Request, res: Response, next: NextFunction) => {
  const { name, image, description, title } = req.body;

  const brand = new Brand.default(
   {
    _id: new mongoose.Types.ObjectId(),
    name,
    image,
    description,
    title,
   }
  );

  try {
   const brandResult = await brand.save();
   return res.status(200).json({ brandResult });
  } catch (error) {
   return res.status(500).json({ error });
  }

 };

 /** ================================================= */
 public static read = async (req: Request, res: Response, next: NextFunction) => {

  const brandId = req.params.brandId;

  try {
   const brand = await Brand.default.findById(brandId);
   if (brand) {
    return res.status(200).json({ brand });
   } else {
    return res.status(400).json({ message: 'Not found' });
   }
  } catch (error) {
   return res.status(500).json({ error });
  }

 };

 /** ================================================= */
 public static readAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
   const brands = await Brand.default.find();
   if (brands) {
    return res.status(200).json({ brands });
   } else {
    return res.status(400).json({ message: 'Not found' });
   }
  } catch (error) {
   return res.status(500).json({ error });
  }
 };

 /** ================================================= */
 public static update = async (req: Request, res: Response, next: NextFunction) => {

  const brandId = req.params.brandId;

  try {
   const brand = await Brand.default.findById(brandId);
   if (brand) {
    brand.set(req.body);
    try {
     await brand.save();
     return res.status(200).json({ brand });
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

 /** ================================================= */
 public static delete = async (req: Request, res: Response, next: NextFunction) => {
  const brandId = req.params.brandId;

  try {
   const brand = await Brand.default.findByIdAndDelete(brandId);
   if (brand) {
    return res.status(200).json({ message: 'Delete Success' });
   } else {
    return res.status(400).json({ message: 'Not found' });
   }
  } catch (error) {
   return res.status(500).json({ error });
  }
 };
}
