import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, PopupRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { UserInfo } from './models/user-info';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ADS HOSTING';
  isIframe = false;
  loginDisplay = false;
  user: UserInfo
  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private broadcastService: MsalBroadcastService,
    private authService: MsalService,
    private userService: UserService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.inProgress$
    .pipe(
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
    })

    this.userService.user
    .pipe(takeUntil(this._destroying$))
    .subscribe((e) => {
      this.user = e;
    })
  }

  login() {
    this.authService.loginPopup(this.msalGuardConfig.authRequest ? {...this.msalGuardConfig.authRequest} as PopupRequest : undefined)
        .subscribe({
          next: (result) => {
            this.setLoginDisplay();
          },
          error: (error) => console.log(error)
        });
  }

  logout() { // Add log out function here
    this._router.navigateByUrl("/");
    this.authService.logoutPopup({
      mainWindowRedirectUri: "/"
    }).toPromise().then( () => {
      this.setLoginDisplay();
    });
  }

  setLoginDisplay() {
    if (this.authService.instance.getAllAccounts().length > 0) {
      const user = this.authService.instance.getAllAccounts()[0];
      const userGroups: string[] = (user.idTokenClaims as any).groups;
      const matchingGroups = userGroups.filter(x => environment.adminGroups.includes(x));
      this.userService.updateLogin(
        {
          userName: user.name,
          id: user.localAccountId,
          type: matchingGroups.length > 0 ? 'admin' : 'user'
        });
      this.loginDisplay = true;
    } else {
      this.userService.updateLogin({userName: undefined, id: undefined, type: undefined});
      this.loginDisplay = false;
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
