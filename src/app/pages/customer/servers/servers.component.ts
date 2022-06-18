import { Component, OnDestroy, OnInit } from '@angular/core';
import { StringSchemaDefinition } from 'mongoose';
import { interval, Subject } from 'rxjs';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { License, LicenseStatus } from '../../../models/license';
import { LicenseService } from '../../../services/license.service';

@Component({
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss']
})
export class ServersComponent implements OnInit, OnDestroy {

  private readonly _destroying$ = new Subject<void>();
  public licenses: LicenseStatus[] = [];
  public readonly displayedColumns: string[] = ['Name', 'Product', 'StartDate', 'JobId', 'Status'];
  constructor(private licenseService: LicenseService) { }

  ngOnInit(): void {
    interval(environment.updateFreq)
    .pipe(
      startWith(0),
      takeUntil(this._destroying$),
      switchMap(() => this.licenseService.getOwnLicensesStatus())
    )
    .subscribe(e => {
      this.licenses = e;
    })
  }

  subcribeToStatus(index: string, id: string): void {}

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
