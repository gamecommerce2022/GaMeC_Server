import Joi from 'joi'
import { Product, Brand, Catergory, Discount } from '../model'

export const Schemas = {
 product: {
  create: Joi.object<Product.IProduct>(),
  update: Joi.object<Product.IProduct>(),
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
 },
}
