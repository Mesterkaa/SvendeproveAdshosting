import { IProduct, Product } from "../models/product";

export class ProductService {
    /**
     * Gets all products stored in the database.
     * @returns All products.
     */
    async getProducts(): Promise<IProduct[]> {
        return await Product.find({});
    }

     /**
     * Create a product.
     * @returns A single document containing the created product.
     */
      async createProduct({Name, Description, Price, Specs}: {Name: string, Description: string, Price: number, Specs: any}): Promise<IProduct> {
        return await Product.create({Name: Name, Description: Description, Price: Price, Specs: Specs});
    }

    /**
     * Updates a product.
     * @returns A single document containing the updated product.
     */
     async updateProduct(product: IProduct): Promise<IProduct | null> {
      return await Product.findByIdAndUpdate(product._id, product);
  }
}
