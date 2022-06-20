import { NextFunction, Request, Response } from "express";
import { ICompany } from "server/models/company";
import { LicenseService } from "../services/licenseService";
import { GitlabService } from "../services/gitlabService";

export class LicenseController{
  licenseService: LicenseService = new LicenseService();
  gitlabService: GitlabService = new GitlabService();

  constructor() {
  }

  /**
     * Create new licenses and starts it's job
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
   * Gets all licenses beloning to the Users company stored in the db
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
 * Gets all licenses and it's status beloning to the Users company stored in the db
 * @param req
 * @param res
 * @param next
 */
  public getLicensesStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const status = await this.licenseService.getLicensesStatusByCompanyId((req.user as ICompany)._id);
        res.send(status)
    } catch (error) {
        next(error);
    }
  }

  /**
 * Deletes a license and it's job
 * @param req
 * @param res
 * @param next
 */
   public deleteLicense = async ({user, body: {Id}}: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const bool = await this.licenseService.deleteLicense((user as ICompany)._id, Id);
        res.send(bool)
    } catch (error) {
        next(error);
    }
  }

    /**
 * Gets a access token for Git repo from a license
 * @param req
 * @param res
 * @param next
 */
     public gitAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
          const token = await this.gitlabService.getAccessToken(req.query.gitlab as string);
          res.send({token: token})
      } catch (error) {
          next(error);
      }
    }
}
