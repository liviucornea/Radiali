import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { User } from '../shared/models';
import { AppState } from '../store/states/appStates';

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
    this.usrSubscription = this.store.select('user').pipe().subscribe( data => {
       this.user = data;
    })
  }

  ngOnDestroy() {
    if (this.usrSubscription) {
      this.usrSubscription.unsubscribe()
    }
  }


}
