import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http"; // Import

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { UsageComponent } from './pages/admin/usage/usage.component';
import { CompaniesListComponent } from './pages/admin/companies-list/companies-list.component';
import { ProductsListComponent } from './pages/admin/products-list/products-list.component';
import { LicensLisstComponent } from './pages/admin/licens-lisst/licens-lisst.component';
import { ServersComponent } from './pages/customer/servers/servers.component';
import { AccountComponent } from './pages/customer/account/account.component';
import { BuyComponent } from './pages/customer/buy/buy.component';
import { RepoComponent } from './pages/customer/repo/repo.component';
import { LoginComponent } from './pages/login/login.component';

import { MsalModule, MsalGuard, MsalInterceptor } from '@azure/msal-angular'; // Import MsalInterceptor
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { ApiInterceptor } from './interceptor/api.interceptor';
import { environment } from 'src/environments/environment';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    UsageComponent,
    CompaniesListComponent,
    ProductsListComponent,
    LicensLisstComponent,
    ServersComponent,
    AccountComponent,
    BuyComponent,
    RepoComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    HttpClientModule,
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
        clientId: environment.clientId,
        authority: environment.authority,
        redirectUri: environment.redirectUri
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE,
      }
    }), {
      interactionType: InteractionType.Popup, // MSAL Guard Configuration
      authRequest: {
        scopes: ['user.read']
      }
  }, {
    interactionType: InteractionType.Popup, // MSAL Interceptor Configuration
    protectedResourceMap: new Map(environment.protectedResourceMap)
  })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    MsalGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
