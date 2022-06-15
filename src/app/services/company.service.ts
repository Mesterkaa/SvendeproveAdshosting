import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>("/api/admin/get_all_companies");
  }

  createCompany(Name: string, GroupId: string): Promise<Company> {
    return this.http.post<Company>('/api/admin/create_company', { Name: Name, GroupId: GroupId}).toPromise<Company>()
  }
}
