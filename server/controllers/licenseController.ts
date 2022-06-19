import { NextFunction, Request, Response } from "express";
import { ICompany } from "server/models/company";
import { LicenseService } from "../services/licenseService";

export class LicenseController{
  licenseService: LicenseService = new LicenseService();

  constructor() {
  }

  /**
     * Gets all licenses stored in the db
     * @param req
     * @param res
     * @param next
     */
  public createLicense = async ({user, body: {productId, stage, name}}: Request, res: Response, next: NextFunction): Promise<void> => {
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
  public getAllLicenses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
   public getLicenses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const licenses = await this.licenseService.getLicensesByCompanyId((req.user as ICompany)._id);
      res.send(licenses)
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gets all status of a License.
   * @param req
   * @param res
   * @param next
   */
   public getLicenseStatus = async ({params: {Id}}: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const status = await this.licenseService.getLicenseStatus(Id);
        res.send(status)
    } catch (error) {
        next(error);
    }
   }

    /**
   * Gets all status of all owned Licenses.
   * @param req
   * @param res
   * @param next
   */
     public getLicensesStatusByCompanyId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
          const status = await this.licenseService.getLicensesStatusByCompanyId((req.user as ICompany)._id);
          res.send(status)
      } catch (error) {
          next(error);
      }
    }

}
