import { NextFunction, Request, Response } from "express";
import { CompanyService } from "../services/companyService";

export class CompanyController{
  private companyService: CompanyService = new CompanyService();

  constructor() {
  }

  /**
   * Gets all companies stored in the db
   * @param req
   * @param res
   * @param next
   */
  public getAllCompanies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companies = await this.companyService.getAllCompanies();
      res.send(companies)
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get company associated to the user based on input
   * @param req
   * @param res
   * @param next
   */
  public getMyCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.send(req.user)
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
  public createCompany = async ({body: {Company}}: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const _company = await this.companyService.createCompany(Company);
      res.send(_company)
    } catch (error) {
      next(error);
    }
  }

  /**
 * Updates a company based on input
 * @param req
 * @param res
 * @param next
 */
  public updateCompany = async ({body: {Company}}: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const _company = await this.companyService.updateCompany(Company);
      res.send(_company)
    } catch (error) {
      next(error);
    }
  }
}
