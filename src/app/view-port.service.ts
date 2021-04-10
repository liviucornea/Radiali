import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ViewPortService {

  private resizeSubject: Subject<boolean>;

  constructor() {
    this.resizeSubject = new Subject();
   }
   get onResize$(): Observable<boolean> {
    return this.resizeSubject.asObservable();
  }

   onResize(isMobile: boolean) {
    this.resizeSubject.next(isMobile);
  }

}
