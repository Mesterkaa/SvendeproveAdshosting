import { Injectable } from '@angular/core';
import { MsalBroadcastService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user: BehaviorSubject<[string | undefined, string | undefined]> = new BehaviorSubject<[string | undefined, string | undefined]>([undefined,undefined]);
  public readonly user: Observable<[string | undefined, string | undefined]> = this._user.asObservable();
  constructor() {
   }

   updateLogin(name: string | undefined, id: string | undefined) {
      this._user.next([name, id])
   }
}
