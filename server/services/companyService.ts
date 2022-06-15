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
     * Create all Companies stored in the database.
     * @returns A single document containing the created Company.
     */
      async createCompany({Name, GroupId}: {Name: string, GroupId: string}): Promise<ICompany> {
        return await Company.create({Name: Name, GroupId: GroupId});
    }
}
