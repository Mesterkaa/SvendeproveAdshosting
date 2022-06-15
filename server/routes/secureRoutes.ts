import { ProductController } from "../controllers/productController";
import { CompanyController } from "../controllers/companyController";
import { Routes } from "./Routes";

/**
 * Defining subroutes for secure routes
 */
export class SecureRoutes extends Routes{
  private productController: ProductController = new ProductController();
  private companyController: CompanyController = new CompanyController();
  private licenseController: CompanyController = new CompanyController();

   constructor(){
       super();
       this.routes();
   }
   protected routes() {
        this.router.get("/get_products", this.productController.getProducts);
        this.router.get("/get_companies", this.companyController.getCompanies);
    }
}
