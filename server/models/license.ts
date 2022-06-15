import { Document, Schema, Model, model, Error } from "mongoose";
import { IProduct } from "./product";
import { ICompany } from "./company";


export interface ILicense extends Document {
  Product: IProduct['_id'];
  Company: ICompany['_id'];
  StartDate: Date;
  JobId: string;
}

export const licenseSchema: Schema = new Schema({
  Product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
  Company: {type: Schema.Types.ObjectId, ref: 'Company', required: true},
  StartDate: {type: Date, required: true},
  JobId: {type: String, required: true},
});

export const License: Model<ILicense> = model<ILicense>("License", licenseSchema);
