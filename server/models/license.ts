import { Document, Schema, Model, model, Error } from "mongoose";
import { IProduct } from "./product";
import { ICompany } from "./company";
import { AwxService } from "../services/awxService";


export interface ILicense extends Document {
  Product: IProduct['_id'];
  Company: ICompany['_id'];
  StartDate: Date;
  Name: string;
  JobId: string;
}

export const licenseSchema: Schema = new Schema({
  Product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
  Company: {type: Schema.Types.ObjectId, ref: 'Company', required: true},
  StartDate: {type: Date, required: true},
  Name: {type: String, required: true},
  JobId: {type: String, required: true},
});

licenseSchema.pre<ILicense>("deleteOne", async function save(next) {
  const awxService: AwxService = new AwxService();
  awxService.deleteJob(this.JobId);
  next();
})

export const License: Model<ILicense> = model<ILicense>("License", licenseSchema);
