import { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import Logging from '../library/logging';

export const ValidateJoi = (schema: ObjectSchema) => {
 return async (req: Request, res: Response, next: NextFunction) => {
  try {
   await schema.validateAsync(req.body);

   next();
  } catch (error) {
   Logging.error(error);

   return res.status(422).json({ error });
  }
 };
};