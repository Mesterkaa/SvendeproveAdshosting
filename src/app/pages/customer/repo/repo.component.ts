import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { License } from '../../../models/license';
import { LicenseService } from '../../../services/license.service';

@Component({
  templateUrl: './repo.component.html',
  styleUrls: ['./repo.component.scss']
})
export class RepoComponent implements OnInit {

  private readonly _destroying$ = new Subject<void>();
  public licenses: License[] = [];
  public accessTokens: {[key: string]: string;} = {};
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
      this.licenses = e
    })
  }

  accessToken(element: License): void {
    this.licenseService.getGitAccessToken(element.Gitlab as string).subscribe(e => {
      if (element._id) this.accessTokens[element._id] = e.token;
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
