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
      'company': company.Name.toLocaleLowerCase(),
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

  public async getJobStatus(jobId: string): Promise<string> {
    return await this.axiosInstance
    .get(`https://awx.adshosting.lan/api/v2/workflow_jobs/${jobId}/`, {headers: { 'Authorization': `Bearer ${awx_token}`}})
    .then(res => {
      return res.data["status"];
    })
    .catch(error => {
      throw error;
    })
  }

}
