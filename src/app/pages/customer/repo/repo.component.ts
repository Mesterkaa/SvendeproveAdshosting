import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { License, LicenseAccessToken } from '../../../models/license';
import { LicenseService } from '../../../services/license.service';

@Component({
  templateUrl: './repo.component.html',
  styleUrls: ['./repo.component.scss']
})
export class RepoComponent implements OnInit {

  private readonly _destroying$ = new Subject<void>();
  public licenses: LicenseAccessToken[] = [];
  public readonly displayedColumns: string[] = ['Name', 'GitUrl', 'Generate', 'AccessToken'];
  constructor(private licenseService: LicenseService, private clipboard: Clipboard) { }

  ngOnInit(): void {
    interval(environment.updateFreq)
    .pipe(
      startWith(0),
      takeUntil(this._destroying$),
      switchMap(() => this.licenseService.getOwnLicenses())
    )
    .subscribe(e => {
      this.licenses = e.map(e => { return {License: e, AccessToken: ''}});
    })
  }

  accessToken(element: LicenseAccessToken): void {
    this.licenseService.getGitAccessToken(element.License.Gitlab as string).subscribe(e => {
      element.AccessToken = e.token;
    })
  }

  copy(str: string) {
    this.clipboard.copy(str);
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
