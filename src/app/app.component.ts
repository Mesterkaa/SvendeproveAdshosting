import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, PopupRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Ads-Web-Applikation';
  isIframe = false;
  loginDisplay = false;
  name = "";
  private readonly _destroying$ = new Subject<void>();

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private broadcastService: MsalBroadcastService, private authService: MsalService, private userService: UserService) { }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
    })

    this.userService.user
    .pipe(takeUntil(this._destroying$))
    .subscribe((e) => {
      this.name = e[0] ? e[0] : "";
    })
  }

  login() {
    this.authService.loginPopup(this.msalGuardConfig.authRequest ? {...this.msalGuardConfig.authRequest} as PopupRequest : undefined)
        .subscribe({
          next: (result) => {
            console.log(result);
            this.userService.updateLogin(result.account?.name, result.account?.localAccountId);
            this.setLoginDisplay();
          },
          error: (error) => console.log(error)
        });
  }

  logout() { // Add log out function here
    this.authService.logoutPopup({
      mainWindowRedirectUri: "/"
    }).toPromise().then( () => {
      this.userService.updateLogin(undefined,undefined);
    });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
