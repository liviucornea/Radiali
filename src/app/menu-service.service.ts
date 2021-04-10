import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuServiceService {

  public showContentSubject: Subject<boolean> = new Subject();

  constructor() { }

  contentSignal(signal: boolean) {
    this.showContentSubject.next(signal);
  }

}
