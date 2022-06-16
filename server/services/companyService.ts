import { ITokenPayload } from "passport-azure-ad";
import { ICompany, Company } from "../models/company";

export class CompanyService {

  /**
   * Gets all companies stored in the database.
   * @returns All companies.
   */
  async getAllCompanies(): Promise<ICompany[]> {
      return await Company.find({});
  }

    /**
   * Get Company by Groupid stored in the database.
   * @returns A single document containing the Company.
   */
  async getCompanyByGroupId(Groups: ITokenPayload['groups']): Promise<ICompany | null> {
    if (!Groups) return null;
    return await Company.findOne({GroupId: { $in: Groups }})
  }

    /**
   * Get Company by id stored in the database.
   * @returns A single document containing the Company.
   */
     async getCompanyById(Id: string): Promise<ICompany | null> {
      return await Company.findById(Id);
    }

  /**
   * Creates a Companies.
   * @returns A single document containing the created Company.
   */
  async createCompany({Name, GroupId}: {Name: string, GroupId: string}): Promise<ICompany> {
    return await Company.create({Name: Name, GroupId: GroupId});
  }
}
