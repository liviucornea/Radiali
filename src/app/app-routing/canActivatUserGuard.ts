import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { filter, switchMap, take } from "rxjs/operators";
import { User } from "../shared/models";
import { AppState } from "../store/states/appStates";

@Injectable()
export class CanActivateUserGuard implements CanActivate {
  constructor(public store: Store<AppState>, private router: Router,) {}

  getUserProfileFromStore(): Observable<User> {
    return this.store.select('user').pipe(take(1));
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const self = this;
    return self.getUserProfileFromStore().pipe(
      switchMap(user => {
        if (!user.isLoggedIn) {
          this.router.navigate(['/login']);
        }
        return of(user.isLoggedIn || user.isLoggingIn);
      }));
  }
}