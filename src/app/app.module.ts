import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http"; // Import

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { CompaniesListComponent } from './pages/admin/companies-list/companies-list.component';
import { ProductsListComponent } from './pages/admin/products-list/products-list.component';
import { LicenseListComponent } from './pages/admin/license-list/license-list.component';
import { ServersComponent } from './pages/customer/servers/servers.component';
import { AccountComponent } from './pages/customer/account/account.component';
import { BuyComponent } from './pages/customer/buy/buy.component';
import { RepoComponent } from './pages/customer/repo/repo.component';

import { MsalModule, MsalGuard, MsalInterceptor } from '@azure/msal-angular'; // Import MsalInterceptor
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { ApiInterceptor } from './interceptor/api.interceptor';
import { environment } from '../environments/environment';
import { EditDataDialogComponent } from './components/edit-data-dialog/edit-data-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    CompaniesListComponent,
    ProductsListComponent,
    LicenseListComponent,
    ServersComponent,
    AccountComponent,
    BuyComponent,
    RepoComponent,
    EditDataDialogComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatCardModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    ClipboardModule,

    HttpClientModule,
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
        clientId: environment.clientId,
        authority: environment.authority,
        redirectUri: environment.redirectUri,
        postLogoutRedirectUri: environment.redirectUri
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
