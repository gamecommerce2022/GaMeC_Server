import mongoose, { Document, Schema } from "mongoose";

export interface IImage {
 images: string[];
 videos: string[];
}

export interface IImageModel extends IImage, Document { }

const ImageSchema: Schema = new Schema(
 {
  images: { type: Schema.Types.Array, required: false },
  videos: { type: Schema.Types.Array, required: false }
 },
 {
  versionKey: false
 }
);

export default mongoose.model<IImageModel>('Image', ImageSchema);