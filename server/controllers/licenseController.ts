import { NextFunction, Request, Response } from "express";
import { LicenseService } from "../services/licenseService";

export class LicenseController{
  licenseService: LicenseService = new LicenseService();

  constructor() {
    this.getAllLicenses = this.getAllLicenses.bind(this);
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
}
