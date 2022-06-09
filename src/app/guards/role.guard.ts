import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  private id: string;
  constructor(private msalService: MsalService, private userService: UserService) {
    this.userService.user.subscribe((e) => {
      this.id = e[1] ? e[1] : "";
    })
   }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userRoles = this.msalService.instance.getAccountByLocalId(this.id)?.idTokenClaims?.roles; //This needs to changed to where the Account is pulled based on Local Id
    if (userRoles == undefined) return false;
    const allowedRoles = next.data["roles"];
    const matchingRoles = userRoles.filter(x => allowedRoles.includes(x));
    return matchingRoles.length > 0;

  }
}
