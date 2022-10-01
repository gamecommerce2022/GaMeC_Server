import Joi from "joi";
import { Info, Image } from "../model";

export const Schemas = {
 info: {
  create: Joi.object<Info.IInfo>({
   name: Joi.string().required()
  }),
  update: Joi.object<Info.IInfo>({
   name: Joi.string().required()
  })
 },
 image: {
  create: Joi.object<Image.IImage>({
  }),
  update: Joi.object<Image.IImage>({
  })
 }
};