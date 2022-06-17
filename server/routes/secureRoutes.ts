import { Routes } from "./Routes";

/**
 * Defining subroutes for routes only accesable to logged in users
 */
export class SecureRoutes extends Routes{

  constructor(){
    super();
    this.routes();
  }
  protected routes() {
    this.router.get("/get_products", this.productController.getProducts);
    this.router.get("/get_company", this.companyController.getMyCompany);
    this.router.get("/get_licenses", this.licenseController.getLicenses);
    this.router.post("/create_license", this.licenseController.createLicense);
  }
}
