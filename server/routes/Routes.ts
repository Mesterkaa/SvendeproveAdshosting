import { ProductController } from "../controllers/productController";
import { CompanyController } from "../controllers/companyController";
import { LicenseController } from "../controllers/licenseController";

import { Router } from "express";

export abstract class Routes {
  protected productController: ProductController = new ProductController();
  protected companyController: CompanyController = new CompanyController();
  protected licenseController: LicenseController = new LicenseController();

  public router: Router;

  constructor() {
      this.router = Router();

  }

  protected abstract routes(): void
}
