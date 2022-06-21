import { Company } from "./company";
import { Product } from "./product";


export interface LicenseStatus {
  License: License,
  Status: any
}

interface BaseLicense {
  _id?: string
  StartDate: Date;
  Name: string;
  JobId: string;
  Cluster?: string;
  ClusterUrl?: string
  Gitlab?: string;
  GitUrl?: string;
}

export interface License extends BaseLicense {
  Product: Product;
  Company: Company;
}
export interface NewLicense extends BaseLicense {
  Product: Product['_id'];
  Company: Company['_id'];
}
