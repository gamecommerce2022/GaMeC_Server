import { Schema, Document } from "mongoose";

export interface IInfo extends Document {
 title: string;
 price: number;
 descriptions: string[];
 shortDescription: string;
 shortImage: string;
 total: number;
}

export const InfoSchema: Schema = new Schema(
 {
  title: { type: String, required: true },
  price: { type: Number, required: true },
  descriptions: { type: Array<string>, required: false },
  shortDescription: { type: String, required: false },
  shortImage: { type: String, required: false },
  total: { type: Number, required: true },
 }
);