/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Product } from "../model";

export default class ProductController {
 /** ================================================= */
 public static create = async (req: Request, res: Response, next: NextFunction) => {
  const { short_image,
   price_after,
   price_before,
   image_list,
   title,
   type,
   max_player,
   release_date,
   language,
   addition_info,
   description,
   addtion_images,
   videos,
   platform, } = req.body;

  const product = new Product.default(
   {
    _id: new mongoose.Types.ObjectId(),
    short_image,
    price_after,
    price_before,
    image_list,
    title,
    type,
    max_player,
    release_date,
    language,
    addition_info,
    description,
    addtion_images,
    videos,
    platform,
   }
  );

  try {
   const productResult = await product.save();
   return res.status(200).json({ productResult });
  } catch (error) {
   return res.status(500).json({ error });
  }

 };

 /** ================================================= */
 public static read = async (req: Request, res: Response, next: NextFunction) => {

  const productId = req.params.productId;

  try {
   const product = await Product.default.findById(productId);
   if (product) {
    return res.status(200).json({ product });
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
   const products = await Product.default.find();
   if (products) {
    return res.status(200).json({ products });
   } else {
    return res.status(400).json({ message: 'Not found' });
   }
  } catch (error) {
   return res.status(500).json({ error });
  }
 };

 /** ================================================= */
 public static update = async (req: Request, res: Response, next: NextFunction) => {

  const productId = req.params.productId;

  try {
   const product = await Product.default.findById(productId);
   if (product) {
    product.set(req.body);
    try {
     await product.save();
     return res.status(200).json({ product });
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
  const productId = req.params.productId;

  try {
   const product = await Product.default.findByIdAndDelete(productId);
   if (product) {
    return res.status(200).json({ message: 'Delete Success' });
   } else {
    return res.status(400).json({ message: 'Not found' });
   }
  } catch (error) {
   return res.status(500).json({ error });
  }
 };
}
