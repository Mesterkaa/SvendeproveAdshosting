import { Company } from "./company";
import { Product } from "./product";

export interface License {
  _id?: string
  Product: Product['_id'];
  Company: Company['_id'];
  StartDate: Date;
  JobId: string;
}
