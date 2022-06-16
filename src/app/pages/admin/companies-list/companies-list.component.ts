import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, interval } from 'rxjs';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company';
import { startWith, takeUntil, switchMap } from 'rxjs/operators';
import {  MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EditDataDialogComponent } from '../../../components/edit-data-dialog/edit-data-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss']
})
export class CompaniesListComponent implements OnInit, OnDestroy {

  private readonly _destroying$ = new Subject<void>();
  public companies: Company[] = [];
  public readonly displayedColumns: string[] = ['Id', 'Name', 'GroupId'];
  constructor(private companyService: CompanyService, public dialog: MatDialog) { }

  ngOnInit(): void {
    interval(environment.updateFreq)
    .pipe(
      startWith(0),
      takeUntil(this._destroying$),
      switchMap(() => this.companyService.getAllCompanies())
    )
    .subscribe(e => {
      this.companies = e;
    })
  }

  createCompany(): void {
    const dialogRef = this.dialog.open(EditDataDialogComponent, { width: '500px', data: {data: {Name: '', GroupId: ''}, labels: ['Company Name', 'Company GroupId'], title: 'Create Company'}});
    dialogRef.afterClosed().subscribe(async (result: Company) => {
      if (result) {
        await this.companyService.createCompany(result);
      }
    })
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
