import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../..//models/product';
import { LicenseService } from '../../../services/license.service';
import { ProductService } from '../../../services/product.service';

@Component({
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss']
})
export class BuyComponent implements OnInit, OnDestroy {

  constructor(private licenseService: LicenseService, private productService: ProductService, private _formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router) { }
  public products: Product[] = [];
  private readonly _destroying$ = new Subject<void>();
  selectedProduct: Product | null = null;
  @ViewChild('stepper') private myStepper: MatStepper;
  formGroup = this._formBuilder.group({
    NameCtrl: ['', Validators.required],
    StageCtrl: ['', Validators.required],
  });

  ngOnInit(): void {
    this.productService.getProducts()
      .pipe(
        takeUntil(this._destroying$)
      )
      .subscribe(e => {
        this.products = e;
      })
  }

  selectProduct(product: Product): void {
    this.selectedProduct = product;
    setTimeout(() => {
      this.myStepper.next()
    })

  }

  reset(): void {
    this.selectedProduct = null;
    this.myStepper.reset();
  }

  confirm(): void {
    if (this.selectedProduct) {
      const id = this.selectedProduct._id as string;
      const stage = this.formGroup.value.StageCtrl as string;
      const name = this.formGroup.value.NameCtrl as string
      this.licenseService.createLicense(id, stage, name).toPromise().then(e => {
        this.snackBar.open(`License, named '${e.Name}', was created and job started with Job id: ${e.JobId}`, 'OK', ({duration: 10000} as MatSnackBarConfig));
        this.router.navigateByUrl('/dashboard')
      });
    } else {
      this.reset();
    }
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
