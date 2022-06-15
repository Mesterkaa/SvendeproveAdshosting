import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { MatDialog } from '@angular/material/dialog';
import { EditDataDialogComponent } from '../../../components/edit-data-dialog/edit-data-dialog.component';

@Component({
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {

  private readonly _destroying$ = new Subject<void>();
  public products: Product[] = []
  public readonly displayedColumns: string[] = ['Id', 'Name', 'Description', 'Price', 'Specs'];
  constructor(private productService: ProductService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.productService.getProducts()
    .pipe(takeUntil(this._destroying$))
      .subscribe(e => {
        this.products = e;
      })
  }

  createProduct(): void {
    const dialogRef = this.dialog.open(EditDataDialogComponent,
      {
        width: '500px',
        data: {
          data: {Name: '', Description: '', Price: 0, Specs: ''},
          title: 'Create Product'
        }
      });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.productService.createProduct(result.Name, result.Description, result.Price, result.Specs)
      }
    })
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
