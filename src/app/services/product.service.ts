import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>("/api/secure/get_products");
  }

  createProduct(Name: string, Description: string, Price: number, Specs: any): Promise<Product> {
    return this.http.post<Product>('/api/admin/create_product', { Name: Name, Description: Description, Price: Price, Specs: Specs}).toPromise<Product>()
  }
}
