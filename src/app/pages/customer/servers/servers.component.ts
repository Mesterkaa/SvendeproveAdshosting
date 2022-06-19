import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StringSchemaDefinition } from 'mongoose';
import { interval, Subject } from 'rxjs';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
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
  public readonly displayedColumns: string[] = ['Name', 'Product', 'StartDate', 'JobId', 'Status', 'Delete'];
  constructor(private licenseService: LicenseService, public dialog: MatDialog) { }

  ngOnInit(): void {
    interval(environment.updateFreq)
    .pipe(
      startWith(0),
      takeUntil(this._destroying$),
      switchMap(() => this.licenseService.getOwnLicensesStatus())
    )
    .subscribe(e => {
      this.licenses = e.sort((a, b) => new Date(b.License.StartDate).getTime() - new Date(a.License.StartDate).getTime());
    })
  }

  delete(licenseStatus: LicenseStatus) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        width: '500px',
        data: {
          text: `Are you sure you want to delete license "${licenseStatus.License.Name}"?`,
          title: 'Confirm delete'
        }
      });
    dialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        console.warn("NOT IMPLEMENTED")
      }
    })
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
