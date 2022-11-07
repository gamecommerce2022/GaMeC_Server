import Joi from "joi";
import { Product, Brand, Catergory, Discount, Info, Image } from "../model";

export const Schemas = {
 product: {
  create: Joi.object<Product.IProduct>({
   short_image: Joi.string().required(),
   price_after: Joi.string(),
   price_before: Joi.string().required(),
   image_list: Joi.array(),
   title: Joi.string().required(),
   type: Joi.string().required(),
   max_player: Joi.string(),
   release_date: Joi.string(),
   language: Joi.string(),
   addition_info: Joi.string(),
   description: Joi.array(),
   addtion_images: Joi.array(),
   videos: Joi.array(),
   platform: Joi.string().required(),
  }),
  update: Joi.object<Product.IProduct>({
   short_image: Joi.string().required(),
   price_after: Joi.string(),
   price_before: Joi.string().required(),
   image_list: Joi.array(),
   title: Joi.string().required(),
   type: Joi.string().required(),
   max_player: Joi.string(),
   release_date: Joi.string(),
   language: Joi.string(),
   addition_info: Joi.string(),
   description: Joi.array(),
   addtion_images: Joi.array(),
   videos: Joi.array(),
   platform: Joi.string().required(),
  }),
 },
 brand: {
  create: Joi.object<Brand.IBrand>({
   name: Joi.string().required(),
   image: Joi.string().allow(''),
   description: Joi.string().allow(''),
   total: Joi.number(),
  }),
  update: Joi.object<Brand.IBrand>({
   name: Joi.string().allow(''),
   image: Joi.string().allow(''),
   description: Joi.string().allow(''),
   total: Joi.number(),
  }),
 },
 category: {
  create: Joi.object<Catergory.ICategory>({
   genre: Joi.string().required(),
   image: Joi.string().allow(''),
   description: Joi.string().allow(''),
  }),
  update: Joi.object<Catergory.ICategory>({
   genre: Joi.string().allow(''),
   image: Joi.string().allow(''),
   description: Joi.string().allow(''),
  }),
 },
 discount: {
  create: Joi.object<Discount.IDiscount>({
   percentage: Joi.number().required(),
   dateFrom: Joi.date(),
   dateTo: Joi.date(),
   description: Joi.string().allow(''),
   image: Joi.string().allow(''),
  }),
  update: Joi.object<Discount.IDiscount>({
   percentage: Joi.number(),
   dateFrom: Joi.date(),
   dateTo: Joi.date(),
   description: Joi.string().allow(''),
   image: Joi.string().allow(''),
  }),
 }
};