import { Document, Schema, Model, model, Error } from "mongoose";


export interface IProduct extends Document {
  Name: string;
  Description: string;
  Price: number;
  Specs: any;
}

export const productSchema: Schema = new Schema({
  Name: {type: String, required: true, trim: true},
  Description: {type: String, required: true},
  Price: {type: Number, required: true},
  Specs: {type: Schema.Types.Mixed, required: true},
});

export const Product: Model<IProduct> = model<IProduct>("Product", productSchema);
