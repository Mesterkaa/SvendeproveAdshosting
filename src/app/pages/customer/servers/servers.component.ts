import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StringSchemaDefinition } from 'mongoose';
import { interval, Subject } from 'rxjs';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { environment } from '../../../../environments/environment';
import { License, LicenseStatus } from '../../../models/license';
import { LicenseService } from '../../../services/license.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss']
})
export class ServersComponent implements OnInit, OnDestroy {

  private readonly _destroying$ = new Subject<void>();
  public licenses: LicenseStatus[] = [];
  public readonly displayedColumns: string[] = ['Name', 'Product', 'StartDate', 'JobId', 'Status', 'Url', 'Delete'];
  constructor(private licenseService: LicenseService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    interval(environment.updateFreq)
    .pipe(
      startWith(0),
      takeUntil(this._destroying$),
      switchMap(() => this.licenseService.getOwnLicensesStatus())
    )
    .subscribe(e => {
      const newData = e.sort((a, b) => new Date(b.License.StartDate).getTime() - new Date(a.License.StartDate).getTime());
      if (JSON.stringify(newData) != JSON.stringify(this.licenses)) {
        this.licenses = newData;
      }
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
        this.licenseService.deleteLicense(licenseStatus.License).subscribe(e => {
          this.snackBar.open(e ? "Success" : "An Error has happend", 'OK', ({duration: 10000} as MatSnackBarConfig));
        });
      }
    })
  }

  upperCase(str: string): string {
    return str.charAt(0).toLocaleUpperCase() + str.slice(1);
  }

  statusClass(status: string): string {
    switch (status) {
      case "running":
        return "running";
      case "pending":
        return "pending";
      case "successful":
        return "success";
      default:
        return "failed";
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
