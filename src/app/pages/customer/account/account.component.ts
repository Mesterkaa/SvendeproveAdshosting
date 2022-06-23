import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subject } from 'rxjs';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';
import { License } from '../../../models/license';
import { environment } from '../../../../environments/environment';
import { LicenseService } from '../../../services/license.service';
import { Company } from '../../../models/company';
import { CompanyService } from '../../../services/company.service';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me/';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
};

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  public profile!: ProfileType;
  public company: Company
  private readonly _destroying$ = new Subject<void>();
  public licenses: License[] = []
  public readonly displayedColumns: string[] = ['Name', 'Product', 'StartDate'];

  constructor(
    private http: HttpClient,
    private licenseService: LicenseService,
    private companyService: CompanyService
  ) { }

  ngOnInit() {
    this.getProfile();
    interval(environment.updateFreq)
    .pipe(
      startWith(0),
      takeUntil(this._destroying$),
      switchMap(() => this.licenseService.getOwnLicenses())
    )
    .subscribe(e => {
      this.licenses = e;
    })
  }

  getProfile() {
    this.http.get(GRAPH_ENDPOINT)
      .subscribe(profile => {
        this.profile = profile;
    });
    this.companyService.getCompany()
      .pipe(takeUntil(this._destroying$))
      .subscribe(e => {
        this.company = e;
      })
  }

  goToGrafana(): void {
    window.open(this.company.GrafanaUrl)
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
