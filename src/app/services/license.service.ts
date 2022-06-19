import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { License, LicenseStatus } from '../models/license';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {

  constructor(private http: HttpClient) { }

  createLicense = (productId: string, stage: string, name: string): Observable<License> => {
    return this.http.post<License>("/api/secure/create_license", {productId: productId, stage: stage, name: name})
  }

  getAllLicenses = (): Observable<License[]> => {
    return this.http.get<License[]>("/api/admin/all_licenses");
  }

  getOwnLicenses = (): Observable<License[]> => {
    return this.http.get<License[]>("/api/secure/licenses");
  }

  getOwnLicensesStatus = (): Observable<LicenseStatus[]> => {
    return this.http.get<LicenseStatus[]>("/api/secure/licenses_status");
  }

  deleteLicense = (license: License): Observable<boolean> => {
    return this.http.put<boolean>("/api/secure/delete_license", {Id: license._id});
  }
}
