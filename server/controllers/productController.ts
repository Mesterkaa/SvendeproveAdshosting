import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/productService";

export class ProductController{
    productService: ProductService = new ProductService();

    constructor() {
    }

    /**
     * Gets all products stored in the db
     * @param req
     * @param res
     * @param next
     */
    public getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const products = await this.productService.getProducts();
            res.send(products)
        } catch (error) {
            next(error);
        }
    }

      /**
   * Creates a product based on input
   * @param req
   * @param res
   * @param next
   */
  public createProduct = async ({body: {Product}}: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const _product = await this.productService.createProduct(Product);
        res.send(_product)
    } catch (error) {
        next(error);
    }
  }

  /**
   * Updates a product based on input
   * @param req
   * @param res
   * @param next
   */
  public updateProduct = async ({body: {Product}}: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const _product = await this.productService.updateProduct(Product);
        res.send(_product)
    } catch (error) {
        next(error);
    }
  }
}
