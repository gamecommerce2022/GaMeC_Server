import express from 'express';
import { Discount } from '../controller';
import { Schemas } from '../middleware';
import { ValidateJoi } from '../../middleware/Joi';

const router = express.Router();

/** discount */
const discountPrefix = "/v1/discount";
/** Create discount */
router.post(`${discountPrefix}/create`, ValidateJoi(Schemas.discount.create), Discount.default.create);

/** Read discount */
router.get(`${discountPrefix}/get/:discountId`, Discount.default.read);
router.get(`${discountPrefix}/get/`, Discount.default.readAll);

/** Update discount */
router.patch(`${discountPrefix}/update/:discountId`, ValidateJoi(Schemas.discount.update), Discount.default.update);

/** Delete discount */
router.delete(`${discountPrefix}/delete/:discountId`, Discount.default.delete);

export default router;