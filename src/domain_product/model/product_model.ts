import mongoose, { Document, Schema } from "mongoose";
import { Info, Image, Brand } from "../model";

export interface IProduct {
 name: String;
 idProduct: String;
 brand: Brand.IBrand;
 info: Info.IInfo;
 image: Image.IImage;

}

export interface IProductModel extends IProduct, Document { }

const IProductSchema: Schema = new Schema(
 {
  idProduct: { type: String, required: true },
  name: { type: String, required: true },
  info: { type: Schema.Types.Mixed, required: false },
  brand: { type: Schema.Types.Mixed, required: false },
  image: { type: Schema.Types.Mixed, required: false },
 },
 {
  timestamps: true,
  versionKey: false
 }
);

export default mongoose.model<IProductModel>('Product', IProductSchema);