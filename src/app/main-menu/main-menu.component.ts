import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { MenuServiceService } from '../menu-service.service';
import { ViewPortService } from '../view-port.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, OnDestroy {
  public showContent = true;
  public isMobile = false;
  private menuSvcSubsc: Subscription;
  private viePortSubsc: Subscription;
  constructor( private menuSvc: MenuServiceService, public router: Router,
    private viewPortSvc: ViewPortService) { }

  

  ngOnInit(): void {
    this.menuSvcSubsc = this.menuSvc.showContentSubject.subscribe(signal => {
      this.showContent = signal;
    });
    this.viePortSubsc = this.viewPortSvc.onResize$.subscribe(isMobile => {
      this.isMobile = isMobile;
      this.showContent = !isMobile;
    })
  }

  ngOnDestroy() {
    this.menuSvcSubsc.unsubscribe();
    this.viePortSubsc.unsubscribe();
  }
  handleNavigation() {
    if (this.isMobile) {
      this.showContent = false;
    }
    // this.router.navigateByUrl(path);
  }

}
