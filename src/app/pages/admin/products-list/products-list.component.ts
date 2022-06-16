import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { MatDialog } from '@angular/material/dialog';
import { EditDataDialogComponent } from '../../../components/edit-data-dialog/edit-data-dialog.component';
import { environment } from 'src/environments/environment';

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
    const dialogRef = this.dialog.open(EditDataDialogComponent,
      {
        width: '500px',
        data: {
          data: {Name: '', Description: '', Price: 0, Specs: ''},
          title: 'Create Product'
        }
      });
    dialogRef.afterClosed().subscribe(async (result: Product) => {
      if (result) {
        this.productService.createProduct(result)
      }
    })
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
