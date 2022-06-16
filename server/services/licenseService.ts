import { ITokenPayload } from "passport-azure-ad";
import { ILicense, License } from "../models/license";
import { CompanyService } from "../services/companyService";

export class LicenseService {
  companyService: CompanyService = new CompanyService();
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
