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
    this.router.get("/products", this.productController.getProducts);
    this.router.get("/company", this.companyController.getMyCompany);
    this.router.get("/licenses", this.licenseController.getLicenses);
    this.router.get("/licenses_status", this.licenseController.getLicensesStatus)
    this.router.post("/create_license", this.licenseController.createLicense);
    this.router.put("/delete_license", this.licenseController.deleteLicense);
  }
}
