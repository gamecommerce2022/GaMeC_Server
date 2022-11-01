import express from 'express';
import { Category } from '../controller';
import { Schemas } from '../middleware';
import { ValidateJoi } from '../../middleware/Joi';

const router = express.Router();

/** category */
const categoryPrefix = "/v1/category";
/** Create category */
router.post(`${categoryPrefix}/create`, ValidateJoi(Schemas.category.create), Category.default.create);

/** Read category */
router.get(`${categoryPrefix}/get/:categoryId`, Category.default.read);
router.get(`${categoryPrefix}/get/`, Category.default.readAll);

/** Update category */
router.patch(`${categoryPrefix}/update/:categoryId`, ValidateJoi(Schemas.category.update), Category.default.update);

/** Delete category */
router.delete(`${categoryPrefix}/delete/:categoryId`, Category.default.delete);

export default router;