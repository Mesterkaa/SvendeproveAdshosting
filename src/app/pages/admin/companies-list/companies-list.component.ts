import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company';
import { takeUntil } from 'rxjs/operators';
import {  MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EditDataDialogComponent } from '../../../components/edit-data-dialog/edit-data-dialog.component';

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
    this.companyService.getAllCompanies()
      .pipe(takeUntil(this._destroying$))
      .subscribe(e => {
        this.companies = e;
      })
  }

  createCompany(): void {
    const dialogRef = this.dialog.open(EditDataDialogComponent, { width: '500px', data: {data: {Name: '', GroupId: ''}, labels: ['Company Name', 'Company GroupId'], title: 'Create Company'}});
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.companyService.createCompany(result.Name, result.GroupId);
      }
    })
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
