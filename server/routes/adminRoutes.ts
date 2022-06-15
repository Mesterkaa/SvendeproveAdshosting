import { ProductController } from "../controllers/productController";
import { CompanyController } from "../controllers/companyController";
import { Routes } from "./Routes";

/**
 * Defining subroutes for getting and saving data
 */
export class AdminRoutes extends Routes{
  private productController: ProductController = new ProductController();
  private companyController: CompanyController = new CompanyController();

   constructor(){
       super();
       this.routes();
   }
   protected routes() {
        this.router.post("/create_product", this.productController.createProduct);
        this.router.post("/create_company", this.companyController.createCompany);
    }
}
