import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesListComponent } from './pages/admin/companies-list/companies-list.component';
import { LicensLisstComponent } from './pages/admin/licens-lisst/licens-lisst.component';
import { ProductsListComponent } from './pages/admin/products-list/products-list.component';
import { UsageComponent } from './pages/admin/usage/usage.component';
import { AccountComponent } from './pages/customer/account/account.component';
import { BuyComponent } from './pages/customer/buy/buy.component';
import { RepoComponent } from './pages/customer/repo/repo.component';
import { ServersComponent } from './pages/customer/servers/servers.component';
import { LoginComponent } from './pages/login/login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    canActivate: [MsalGuard],
    children: [
      {
        path: '',
        component: ServersComponent,
      },
      {
        path: 'account',
        component: AccountComponent
      },
      {
        path: 'buy',
        component: BuyComponent
      },
      {
        path: 'repo',
        component: RepoComponent
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [MsalGuard, RoleGuard],
    data: {
      groups: [ '9a6d484e-2bc9-4208-ac59-c849987ebf43' ]
    },
    children: [
      {
        path: '',
        component: UsageComponent,
      },
      {
        path: 'companies',
        component: CompaniesListComponent
      },
      {
        path: 'products',
        component: ProductsListComponent
      },
      {
        path: 'licenses',
        component: LicensLisstComponent
      }
    ]
  }

];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: !isIframe ? 'enabledBlocking' : 'disabled' // Don't perform initial navigation in iframes
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
