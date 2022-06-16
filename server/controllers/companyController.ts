import { NextFunction, Request, Response } from "express";
import { CompanyService } from "../services/companyService";

export class CompanyController{
  companyService: CompanyService = new CompanyService();

  constructor() {
    this.getAllCompanies = this.getAllCompanies.bind(this);
    this.getMyCompany = this.getMyCompany.bind(this);
    this.createCompany = this.createCompany.bind(this);
  }

  /**
   * Gets all companies stored in the db
   * @param req
   * @param res
   * @param next
   */
  public async getAllCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
          const companies = await this.companyService.getAllCompanies();
          res.send(companies)
      } catch (error) {
          next(error);
      }
  }

  public async getMyCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authInfo: any = req.authInfo;
      const company = await this.companyService.getCompanyByGroupId(authInfo.groups);
      res.send(company)
    } catch (error) {
        next(error);
    }
}

    /**
   * Creates a company based on input
   * @param req
   * @param res
   * @param next
   */
  public async createCompany({body: {Company}}: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const _company = await this.companyService.createCompany(Company);
      res.send(_company)
    } catch (error) {
      next(error);
    }
  }
}
