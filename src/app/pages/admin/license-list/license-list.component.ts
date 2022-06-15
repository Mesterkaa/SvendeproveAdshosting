import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { License } from '../../../models/license';
import { LicenseService } from '../../../services/license.service';

@Component({
  templateUrl: './license-list.component.html',
  styleUrls: ['./license-list.component.scss']
})
export class LicenseListComponent implements OnInit, OnDestroy {

  private readonly _destroying$ = new Subject<void>();
  public licenses: License[] = [];
  public readonly displayedColumns: string[] = ['Id', 'Product', 'Company', 'StartDate', 'JobId'];
  constructor(private licenseService: LicenseService) { }

  ngOnInit(): void {
    this.licenseService.getAllLicenses()
      .pipe(takeUntil(this._destroying$))
      .subscribe(e => {
        this.licenses = e;
      })
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
