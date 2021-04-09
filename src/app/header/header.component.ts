import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { User } from '../shared/models';
import { AppState } from '../store/states/appStates';
import { UserActions } from '../../app/store/actions';
import { userSessionStarted } from '../store/actions/userActions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public user : User;
  public usrSubscription: Subscription;
  constructor(public translate: TranslateService,
    public store: Store<AppState>) { }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit(): void {
    let localStoregeUser = <User> JSON.parse(localStorage.getItem('user'));
    if (localStoregeUser && localStoregeUser.isLoggedIn) {
      this.store.dispatch(userSessionStarted({user: localStoregeUser}));
    }
    this.usrSubscription = this.store.select('user').pipe().subscribe( data => {
       this.user = data;
    })
  }
  doLogout() {
    this.store.dispatch( UserActions.guestUserLoaded());
  }

  ngOnDestroy() {
    if (this.usrSubscription) {
      this.usrSubscription.unsubscribe()
    }
  }


}
