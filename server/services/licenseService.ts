import { ITokenPayload } from "passport-azure-ad";
import { ICompany } from "../models/company";
import { ILicense, License } from "../models/license";
import { CompanyService } from "../services/companyService";
import { AwxService } from "../services/awxService";
import { IProduct, Product } from "../models/product";

export class LicenseService {
  companyService: CompanyService = new CompanyService();
  awxService: AwxService = new AwxService();

  /**
   * Creates a new license, by launching a new job and storing the JobId.
   * @returns Newly created license.
   */
  async createLicense(company: ICompany, productId: string, stage: string, name: string): Promise<ILicense | null> {
    const product: IProduct | null = await Product.findById(productId);
    if (!product) return null
    const result = await this.awxService.launchJob(stage, product, company);
    return await (await License.create({Product: product._id, Company: company._id, JobId: result, Name: name, StartDate: new Date()})).populate(["Product", "Company"]);
  }

  /**
   * Gets all licenses stored in the database.
   * @returns All licenses.
   */
  async getAllLicense(): Promise<ILicense[]> {
      return await License.find({}).populate(['Product', 'Company']);
  }

  /**
   * Gets all licenses owned by a company via GroupId stored in the database.
   * @returns All licenses.
   */
  async getLicenseByGroupId(Groups: ITokenPayload['groups']): Promise<ILicense[] | null> {
    const company = await this.companyService.getCompanyByGroupId(Groups);
    if (!company) return null;
    return await this.getLicenseByCompanyId(company._id);
  }

  /**
   * Gets all licenses owned by a company via _id stored in the database.
   * @returns All licenses.
   */
   async getLicenseByCompanyId(Id: string): Promise<ILicense[] | null> {
    return await License.findById(Id).populate(['Product', 'Company']);
  }
}
