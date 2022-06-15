import { Routes } from "./Routes";

/**
 * Defining subroutes for getting and saving data
 */
export class PublicRoutes extends Routes{

   constructor(){
       super();
       this.routes();
   }
   protected routes() {
        //this.router.get("/get_data", this.dataController.getData);
        //this.router.post("/save_data", this.dataController.saveData);
    }
}
