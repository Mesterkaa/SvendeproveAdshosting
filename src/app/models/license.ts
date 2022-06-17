import { Company } from "./company";
import { Product } from "./product";

export interface License {
  _id?: string
  Product: Product;
  Company: Company;
  StartDate: Date;
  Name: string;
  JobId: string;
}

export interface NewLicense {
  _id?: string
  Product: Product['_id'];
  Company: Company['_id'];
  StartDate: Date;
  Name: string;
  JobId: string;
}
