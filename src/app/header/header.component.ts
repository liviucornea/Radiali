import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { User } from '../shared/models';
import { AppState } from '../store/states/appStates';
import { UserActions } from '../../app/store/actions';
import { userSessionStarted } from '../store/actions/userActions';
import { Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { ViewPortService } from '../view-port.service';
import { MenuServiceService } from '../menu-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  public user : User;
  public usrSubscription: Subscription;
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;
  constructor(public translate: TranslateService,
              private router: Router,
              private menuSvc: MenuServiceService,
              private viewPortSvc: ViewPortService,
              public store: Store<AppState>) { }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  showMenu() {
    this.menuSvc.contentSignal(true);
  }
  ngOnInit(): void {
    let localStoregeUser = <User> JSON.parse(localStorage.getItem('user'));
    if (localStoregeUser && localStoregeUser.isLoggedIn) {
      this.store.dispatch(userSessionStarted({user: localStoregeUser}));
    }
    this.usrSubscription = this.store.select('user').pipe().subscribe( data => {
       this.user = data;
    });
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      this.viewPortSvc.onResize(this.isMobile);
    })
  }
  doLogout() {
    this.store.dispatch( UserActions.guestUserLoaded());
    this.router.navigateByUrl('/home');
  }

  ngOnDestroy() {
    if (this.usrSubscription) {
      this.usrSubscription.unsubscribe()
    }
  }

  get isMobile(){
    // credit to Timothy Huang for this regex test: 
    // https://dev.to/timhuang/a-simple-way-to-detect-if-browser-is-on-a-mobile-device-with-javascript-44j3
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // console.log('is mobile');
        return true;
   }
   else{
        // console.log('is not mobile mobile');
        return false;
        
   }
   
}
ngAfterViewInit() {
  setTimeout(()=> {
    this.viewPortSvc.onResize(this.isMobile);
  }, 300);
    
  }
}
