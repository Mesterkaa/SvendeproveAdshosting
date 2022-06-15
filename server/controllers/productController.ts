import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/productService";

export class ProductController{
    productService: ProductService = new ProductService();

    constructor() {
      this.getProducts = this.getProducts.bind(this);
      this.createProduct = this.createProduct.bind(this);
    }

    /**
     * Gets all products stored in the db
     * @param req
     * @param res
     * @param next
     */
    public async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const products = await this.productService.getProducts();
            res.send(products)
        } catch (error) {
            next(error);
        }
    }

        /**
     * Creates and product based on input
     * @param req
     * @param res
     * @param next
     */
         public async createProduct({body: {product}}: Request, res: Response, next: NextFunction): Promise<void> {
          try {
              const _product = await this.productService.createProduct(product);
              res.send(_product)
          } catch (error) {
              next(error);
          }
      }
}
