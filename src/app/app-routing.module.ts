import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesListComponent } from './pages/admin/companies-list/companies-list.component';
import { LicenseListComponent } from './pages/admin/license-list/license-list.component';
import { ProductsListComponent } from './pages/admin/products-list/products-list.component';
import { AccountComponent } from './pages/customer/account/account.component';
import { BuyComponent } from './pages/customer/buy/buy.component';
import { RepoComponent } from './pages/customer/repo/repo.component';
import { ServersComponent } from './pages/customer/servers/servers.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

import { MsalGuard } from '@azure/msal-angular';
import { AdminGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
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
    canActivate: [MsalGuard, AdminGuard],
    children: [
      {
        path: 'licenses',
        component: LicenseListComponent
      },
      {
        path: 'companies',
        component: CompaniesListComponent
      },
      {
        path: 'products',
        component: ProductsListComponent
      }

    ]
  }

];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true//,
    //initialNavigation: !isIframe ? 'enabledBlocking' : 'disabled' // Don't perform initial navigation in iframes
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
