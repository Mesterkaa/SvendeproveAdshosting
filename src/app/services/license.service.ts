import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { License } from '../models/license';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {

  constructor(private http: HttpClient) { }

  getAllLicenses(): Observable<License[]> {
    return this.http.get<License[]>("/api/admin/get_all_licenses");
  }
}
