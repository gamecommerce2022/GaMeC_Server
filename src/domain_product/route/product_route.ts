import express from 'express';
import { Info, Image } from '../controller';
import { Schemas } from '../middleware';
import { ValidateJoi } from '../../middleware/Joi';

const router = express.Router();

/** Info */
router.post('/createInfo', ValidateJoi(Schemas.info.create), Info.default.create);
router.get('/getInfo/:infoId', Info.default.read);
router.get('/getInfo/', Info.default.readAll);
router.patch('/updateInfo/:infoId', ValidateJoi(Schemas.info.create), Info.default.update);
router.delete('/deleteInfo/:infoId', Info.default.delete);

/** Image */
router.post('/createImages', ValidateJoi(Schemas.image.create), Image.default.create);
router.get('/getImages/:imageId', Image.default.read);
router.get('/getImages/', Image.default.readAll);
router.patch('/updateImages/:imageId', ValidateJoi(Schemas.image.create), Image.default.update);
router.delete('/deleteImages/:imageId', Image.default.delete);

export default router;