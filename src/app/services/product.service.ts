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

  createProduct(product: Product): Promise<Product> {
    return this.http.post<Product>('/api/admin/create_product', {Product: product}).toPromise<Product>()
  }
}
