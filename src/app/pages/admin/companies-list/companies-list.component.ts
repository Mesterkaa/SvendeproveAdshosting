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
  public readonly displayedColumns: string[] = ['Id', 'Name', 'GroupId', 'GrafanaUrl', 'Edit'];
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
    this.openDialog(this.companyService.createCompany);
  }

  updateCompany(company: Company): void {
    this.openDialog(this.companyService.updateCompany, company);
  }

  openDialog(callBack: (company: Company) => Promise<any>, company?: Company) {
    let data = {Name: '', GroupId: '', GrafanaUrl: ''};
    let title = 'Create Company';
    let confirm = 'Create';
    if (company) {
      data.Name = company.Name;
      data.GroupId = company.GroupId;
      data.GrafanaUrl = company.GrafanaUrl
      title = 'Update Company: ' + company._id;
      confirm = 'Update';
    }
    const dialogRef = this.dialog.open(EditDataDialogComponent, { width: '500px', data: {data: data, title: title, confirm: confirm}});
    dialogRef.afterClosed().subscribe(async (result: Company) => {
      if (result) {
        await callBack({...company, ...result});
      }
    })
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
