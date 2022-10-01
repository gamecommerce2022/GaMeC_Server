import mongoose, { Document, Schema } from "mongoose";

export interface IInfo {
 name: string;
}

export interface IInfoModel extends IInfo, Document { }

const InfoSchema: Schema = new Schema(
 {
  name: { type: String, required: true }
 },
 {
  timestamps: true,
  versionKey: false
 }
);

export default mongoose.model<IInfoModel>('Info', InfoSchema);