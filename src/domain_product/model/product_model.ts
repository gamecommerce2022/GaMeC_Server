import mongoose, { Document, Schema } from "mongoose";
import { Info, Image, Discount, Brand, Catergory } from "../model";

export interface IProduct {
 brand: Brand.IBrand['_id'];
 info: Info.IInfo;
 image: Image.IImage;
 category: Catergory.ICategory['_id'];
 discount: Discount.IDiscount['_id'];
}

export interface IProductModel extends IProduct, Document { }

const IProductSchema: Schema = new Schema(
 {
  info: { type: Info.InfoSchema, required: true },
  brand: { type: Schema.Types.ObjectId, required: true },
  image: { type: Image.ImageSchema, required: false },
  discount: { type: Schema.Types.ObjectId, required: false },
  category: { type: Schema.Types.ObjectId, required: true },
 },
 {
  timestamps: true,
  versionKey: false
 }
);

export default mongoose.model<IProductModel>('Product', IProductSchema);