import { awx_token } from '../config/config.json'
import { ILicense, License } from '../models/license';
import { ICompany, Company } from '../models/company';
import { IProduct, Product } from '../models/product';
import axios, { AxiosError } from 'axios';
import * as https from 'https';

export class AwxService {
  axiosInstance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  })
  public async launchJob(stage: string, product: IProduct, company: ICompany): Promise<string> {
    return await this.axiosInstance
    .post(`https://awx.adshosting.lan/api/v2/workflow_job_templates/17/launch/`,
      { 'extra_vars': {
      'company': company.Name,
      'stage': stage,
      'tier': product.Name.toLocaleLowerCase(),
      'replicas': 2,
      'amountofclusters': 1,
      'vm_datacenter': 'ADShosting Datacenter'
      }},
      {headers: { 'Authorization': `Bearer ${awx_token}`}})
    .then(res => {
      return (res.data.id as string);
    })
    .catch((error: any) => {
      throw error;
    })
  }

  public async getLicenseStatus(_id: string): Promise<any> {
    let license: ILicense | null = await License.findById(_id);
    if (!license) return null;
    return this.getJobStatus(license.JobId);
  }

  public async getJobStatus(jobId: string): Promise<any> {
    return await this.axiosInstance
    .get(`https://awx.adshosting.lan/api/v2/workflow_jobs/${jobId}/`, {headers: { 'Authorization': `Bearer ${awx_token}`}})
    .then(res => {
      return res;
    })
    .catch(error => {
      throw error;
    })
  }

}
