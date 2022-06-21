import { ICompany } from "../models/company";
import { ILicense, License } from "../models/license";
import { CompanyService } from "./companyService";
import { AwxService } from "./awxService";
import { IProduct, Product } from "../models/product";
import mongoose from "mongoose";
import { GitlabService } from "./gitlabService";

export class LicenseService {
  private companyService: CompanyService = new CompanyService();
  private awxService: AwxService = new AwxService();
  private gitlabService: GitlabService = new GitlabService();

  /**
   * Creates a new license, by launching a new job and storing the JobId.
   * @param company Company owning the license
   * @param productId Product license is based on
   * @param stage Stage name
   * @param name Name for UI
   * @returns Newly created license.
   */
  async createLicense(company: ICompany, productId: string, stage: string, name: string): Promise<ILicense | null> {
    const product: IProduct | null = await Product.findById(productId);
    if (!product) return null
    const result = await this.awxService.launchJob(stage, product, company);
    setTimeout(async () => {
      const info = await this.awxService.getExtraIds(Number(result), 0);
      const GitUrl = await this.gitlabService.getGitUrl(info.Gitlab);

      const license = await License.findOne({JobId: result});
      if (!license) throw new Error("New license has been removed");
      license.Cluster = info.Cluster;
      license.Gitlab = info.Gitlab;
      license.ClusterUrl = info.ClusterUrl;
      license.GitUrl = GitUrl.replace(".lan", ".dk");
      license.save();
    }, 1000);
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
   * Get the status of a job assioted with a license.
   * @param _id License id
   * @returns Status of the job.
   */
  public async getLicenseStatus(_id: string): Promise<string | null> {
    let license: ILicense | null = await License.findById(_id);
    if (!license) return null;
    return await this.awxService.getJobStatus(license.JobId);
  }

  /**
   * Get the status of all jobs owned by a company.
   * @param Id Company Id of the licenses owner
   * @returns All owned Licenses with status.
   */
  public async getLicensesStatusByCompanyId(Id: string): Promise<{License: ILicense, Status: string | null}[] | null> {
    const licenses = await this.getLicensesByCompanyId(Id);
    if (!licenses) return null;
    const statusMap = await Promise.all(licenses.map(async e => {
      const status = await this.getLicenseStatus(e._id);
      return {License: e, Status: status};
    }))
    return statusMap;

  }

  /**
   * Gets all licenses owned by a company via _id stored in the database.
   * @returns All licenses.
   */
   async getLicensesByCompanyId(Id: string): Promise<ILicense[] | null> {
    return await License.find({Company: Id}).populate(['Product', 'Company']);
  }

  /**
   * Deletes a license and it's job.
   * @returns true if success.
   */
   async deleteLicense(companyId: mongoose.Types.ObjectId, license_id: string): Promise<boolean> {
    const license = await License.findById(license_id).populate(['Company']);
    if (license == null || !companyId.equals(license.Company['_id'])) return false;
    await this.awxService.deleteJob(license);
    license.delete();

    return true;
  }
}
