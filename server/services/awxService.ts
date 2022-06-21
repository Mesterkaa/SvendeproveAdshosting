import { awx_token, api_urls } from '../config/config.json'
import { ILicense, License } from '../models/license';
import { ICompany, Company } from '../models/company';
import { IProduct, Product } from '../models/product';
import axios, { AxiosError } from 'axios';
import * as https from 'https';

export class AwxService {
  private axiosInstance = axios.create({
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
    .then(async res => {
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
      return res.data['status'];
    })
    .catch(error => {
      throw error;
    });
  }

  /**
   * Delete job
   * @param license Job owner License
   */
   public async deleteJob(license: ILicense): Promise<string> {
    // What if cluster and gitlab is undefined
    return await this.axiosInstance
    .post(`${api_urls.awx}/workflow_job_templates/21/launch/`,
      { 'extra_vars': {
        'cluster': license.Cluster,
        'gitlabproject': license.Gitlab
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
   * Gets extra ids and info
   * @param jobId Number of the current job
   * @param iteration Recursive number that controls it doesn't go on forever
   */
  public async getExtraIds(jobId: number, iteration: number = 0): Promise<{Cluster: string, ClusterUrl: string, Gitlab: string}> {
    return await this.axiosInstance
      .get(`${api_urls.awx}/jobs/${jobId + 1}`, {headers: { 'Authorization': `Bearer ${awx_token}`}})
      .then(async res => {

        const cluster = res.data['artifacts']['clusterfacts']['id'];
        const gitlab = res.data['artifacts']['gitlab']['gitlabproject'];
        const clusterUrl = res.data['artifacts']['dnsrecord'];

        const info = { Cluster: cluster, ClusterUrl: clusterUrl, Gitlab: gitlab };
        return info;
      })
      .catch(async (error: any) => {
        if (iteration < 500) {
          return await new Promise(resolve => setTimeout(async () => {
            resolve(await this.getExtraIds(jobId, iteration + 1));
          }, 2000))
        } else {
          throw error;
        }
      })
  }

}
