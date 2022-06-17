import { NextFunction, Request, Response } from "express";
import { ICompany } from "server/models/company";
import { LicenseService } from "../services/licenseService";

export class LicenseController{
  licenseService: LicenseService = new LicenseService();

  constructor() {
    this.createLicense = this.createLicense.bind(this);
    this.getAllLicenses = this.getAllLicenses.bind(this);
    this.getLicenses = this.getLicenses.bind(this);
  }

  /**
     * Gets all licenses stored in the db
     * @param req
     * @param res
     * @param next
     */
  public async createLicense({user, body: {productId, stage, name}}: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const licenses = await this.licenseService.createLicense((user as ICompany), productId, stage, name);
        res.send(licenses)
    } catch (error) {
        next(error);
    }
  }

  /**
   * Gets all licenses stored in the db
   * @param req
   * @param res
   * @param next
   */
  public async getAllLicenses(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
          const licenses = await this.licenseService.getAllLicense();
          res.send(licenses)
      } catch (error) {
          next(error);
      }
  }

  /**
   * Gets licenses beloning to the Users company stored in the db
   * @param req
   * @param res
   * @param next
   */
   public async getLicenses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const licenses = await this.licenseService.getLicenseByCompanyId((req.user as ICompany)._id);
      res.send(licenses)
    } catch (error) {
      next(error);
    }
}
}
