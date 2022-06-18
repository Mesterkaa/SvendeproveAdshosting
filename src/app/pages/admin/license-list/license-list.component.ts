import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { License } from '../../../models/license';
import { LicenseService } from '../../../services/license.service';

@Component({
  templateUrl: './license-list.component.html',
  styleUrls: ['./license-list.component.scss']
})
export class LicenseListComponent implements OnInit, OnDestroy {

  private readonly _destroying$ = new Subject<void>();
  public licenses: License[] = [];
  public readonly displayedColumns: string[] = ['Id', 'Name', 'Product', 'Company', 'StartDate', 'JobId'];
  constructor(private licenseService: LicenseService) { }

  ngOnInit(): void {
    interval(environment.updateFreq)
    .pipe(
      startWith(0),
      takeUntil(this._destroying$),
      switchMap(() => this.licenseService.getAllLicenses())
    )
    .subscribe(e => {
      console.log(e);
      this.licenses = e;
    })
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
