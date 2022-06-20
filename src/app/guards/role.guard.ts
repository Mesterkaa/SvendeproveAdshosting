import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  private id: string;
  constructor(private msalService: MsalService, private userService: UserService) {
    this.userService.user.subscribe((e) => {
      this.id = e.id ? e.id : "";
    })
   }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const groups = this.msalService.instance.getAccountByLocalId(this.id)?.idTokenClaims?.groups as string[];
    if (groups == undefined) return false;
    const matchingGroups = groups.filter(x => environment.adminGroups.includes(x));
    return matchingGroups.length > 0;

  }

}
