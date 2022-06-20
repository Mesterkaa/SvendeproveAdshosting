import { Company } from "./company";
import { Product } from "./product";


export interface LicenseStatus {
  License: License,
  Status: any
}

export interface LicenseAccessToken {
  License: License,
  AccessToken: string
}

export interface License {
  _id?: string
  Product: Product;
  Company: Company;
  StartDate: Date;
  Name: string;
  JobId: string;
  Cluster?: string;
  Gitlab?: string;
  GitUrl?: string;
}

export interface NewLicense {
  _id?: string
  Product: Product['_id'];
  Company: Company['_id'];
  StartDate: Date;
  Name: string;
  JobId: string;
  Cluster?: string;
  Gitlab?: string;
  GitUrl?: string;
}
