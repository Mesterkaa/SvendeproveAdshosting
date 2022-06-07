import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
