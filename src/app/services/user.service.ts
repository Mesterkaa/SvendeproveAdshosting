import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInfo } from '../models/user-info';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user: BehaviorSubject<UserInfo> = new BehaviorSubject<UserInfo>(new UserInfo());
  public readonly user: Observable<UserInfo> = this._user.asObservable();
  constructor() {
   }

   updateLogin = (userInfo: UserInfo) => {
      this._user.next(userInfo)
   }
}


