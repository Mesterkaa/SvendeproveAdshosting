import { Routes } from "./Routes";

/**
 * Defining subroutes for routes only accesable to admins
 */
export class AdminRoutes extends Routes{

  constructor(){
    super();
    this.routes();
  }
  protected routes() {
    this.router.get("/all_companies", this.companyController.getAllCompanies);
    this.router.get("/all_licenses", this.licenseController.getAllLicenses);

    this.router.post("/create_product", this.productController.createProduct);
    this.router.post("/create_company", this.companyController.createCompany);

    this.router.put("/update_product", this.productController.updateProduct);
    this.router.put("/update_company", this.companyController.updateCompany);

  }
}
