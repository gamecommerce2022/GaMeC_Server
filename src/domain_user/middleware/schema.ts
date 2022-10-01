import Joi from "joi";
import { User } from "../model";

export const Schemas = {
 user: {
  create: Joi.object<User.IUser>({
   name: Joi.string().required()
  }),
  update: Joi.object<User.IUser>({
   name: Joi.string().required()
  })
 },
};