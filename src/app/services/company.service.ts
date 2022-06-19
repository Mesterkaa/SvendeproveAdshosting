import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  getAllCompanies = (): Observable<Company[]> => {
    return this.http.get<Company[]>("/api/admin/all_companies");
  }

  getCompany = (): Observable<Company> => {
    return this.http.get<Company>("/api/secure/company");
  }

  createCompany = (company: Company): Promise<Company> => {
    return this.http.post<Company>('/api/admin/create_company', {Company: company}).toPromise<Company>()
  }

  updateCompany = (company: Company): Promise<Company> => {
    return this.http.put<Company>('/api/admin/update_company', {Company: company}).toPromise<Company>()
  }
}
