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
    }
}
