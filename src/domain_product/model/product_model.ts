import mongoose, { Document, Schema } from "mongoose";

export interface IProduct {
 short_image: string;
 price_after: string;
 price_before: string;
 image_list: string[];
 title: string;
 type: string;
 max_player: string;
 release_date: string;
 language: string;
 addition_info: string;
 description: string[];
 addtion_images: string[];
 videos: string[];
 platform: string;
}

export interface IProductModel extends IProduct, Document { }

const IProductSchema: Schema = new Schema(
 {
  short_image: { type: String, required: true },
  price_after: { type: String, required: false },
  price_before: { type: String, required: true },
  image_list: { type: Schema.Types.Array, required: false },
  title: { type: String, required: true },
  type: { type: String, required: true },
  max_player: { type: String, required: false },
  release_date: { type: String, required: false },
  language: { type: String, required: false },
  addition_info: { type: String, required: false },
  description: { type: Schema.Types.Array, required: false },
  addtion_images: { type: Schema.Types.Array, required: false },
  videos: { type: Schema.Types.Array, required: false },
  platform: { type: String, required: true },
 },
 {
  timestamps: true,
  versionKey: false
 }
);

export default mongoose.model<IProductModel>('Product', IProductSchema);