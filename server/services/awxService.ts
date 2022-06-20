import { awx_token, api_urls } from '../config/config.json'
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

  /**
   * Launch a new job
   * @param stage name of the wanted stage
   * @param product product of which the job is based on
   * @param company company of the job owner
   */
  public async launchJob(stage: string, product: IProduct, company: ICompany): Promise<string> {
    return await this.axiosInstance
    .post(`${api_urls.awx}/workflow_job_templates/17/launch/`,
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

  /**
   * Get status of a job
   * @param jobId Id of the wanted job
   */
  public async getJobStatus(jobId: string): Promise<string> {
    return await this.axiosInstance
    .get(`${api_urls.awx}/workflow_jobs/${jobId}/`, {headers: { 'Authorization': `Bearer ${awx_token}`}})
    .then(res => {
      return res.data["status"];
    })
    .catch(error => {
      throw error;
    })
  }

  /**
   * Delete job
   * @param jobId Id of the wanted job
   */
   public async deleteJob(jobId: string): Promise<any> {
    const cluster = "";
    const gitlabproject = "";
    return await this.axiosInstance
    .post(`${api_urls.awx}/workflow_job_templates/17/launch/`,
      { 'extra_vars': {
        'cluster': cluster,
        'gitlabproject': gitlabproject
      }},
      {headers: { 'Authorization': `Bearer ${awx_token}`}})
    .then(res => {
      return (res.data.id as string);
    })
    .catch((error: any) => {
      throw error;
    })
  }

  public async clusterId(jobId: string): Promise<string> {
    const intJobId = Number(jobId);
    if (intJobId == NaN) throw new Error("jobId is not a number");
    return await this.axiosInstance
      .get(`${api_urls.awx}/jobs/${intJobId + 1}`, {headers: { 'Authorization': `Bearer ${awx_token}`}})
      .then(res => {
        return res.data["clusterfacts"]["id"];
      })
      .catch((error: any) => {
        throw error;
      })
  }

}
