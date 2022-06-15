import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

  constructor(private http: HttpClient) { }
  products: any;

  ngOnInit(): void {
    this.http.get("/api/secure/get_products").subscribe(e => {
      this.products = e;
      console.log(e);
    })
  }

}
