import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { MatDialog } from '@angular/material/dialog';
import { EditDataDialogComponent } from '../../../components/edit-data-dialog/edit-data-dialog.component';
import { environment } from '../../../../environments/environment';

@Component({
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {

  private readonly _destroying$ = new Subject<void>();
  public products: Product[] = []
  public readonly displayedColumns: string[] = ['Id', 'Name', 'Description', 'Price', 'Specs', 'Edit'];
  constructor(private productService: ProductService, public dialog: MatDialog) { }

  ngOnInit(): void {
    interval(environment.updateFreq)
    .pipe(
      startWith(0),
      takeUntil(this._destroying$),
      switchMap(() => this.productService.getProducts())
    )
    .subscribe(e => {
      this.products = e;
    })
  }

  createProduct(): void {
    this.openDialog(this.productService.createProduct);

  }

  updateProduct(product: Product): void {
    this.openDialog(this.productService.updateProduct, product)
  }

  openDialog(callBack: (product: Product) => Promise<any>, product?: Product) {
    let data = {Name: '', Description: '', Price: 0, Specs: ''};
    let title = 'Create Product';
    let confirm = 'Create';
    if (product) {
      data.Name = product.Name;
      data.Description = product.Description;
      data.Price = product.Price;
      data.Specs = product.Specs;
      title = 'Update Product: ' + product._id;
      confirm = 'Update';
    }
    const dialogRef = this.dialog.open(EditDataDialogComponent, { width: '500px', data: {data: data, title: title, confirm: confirm}});
    dialogRef.afterClosed().subscribe(async (result: Product) => {
      if (result) {

        await callBack({...product, ...result});
      }
    })
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
