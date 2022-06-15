import { Document, Schema, Model, model, Error } from "mongoose";


export interface ICompany extends Document {
  Name: string;
  GroupId: string;
}

export const companySchema: Schema = new Schema({
  Name: {type: String, required: true, trim: true},
});

export const Company: Model<ICompany> = model<ICompany>("Company", companySchema);
