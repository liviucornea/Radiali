import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap, first, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/appStates';
@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(public store: Store<AppState>) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select('user').pipe(
            first(),
            mergeMap(user => {
                const authReq = !!user.user_token ? request.clone({
                  setHeaders: { Authorization: 'Bearer ' + user.user_token },
                }) : request;
                console.log('Interceptor is triggered');
                return next.handle(authReq);
              }),
            );
    }
}