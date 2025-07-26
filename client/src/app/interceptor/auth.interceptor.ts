import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { DataStore } from './../store/data.store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly dataStore = inject(DataStore);

  public intercept(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: HttpRequest<any>,
    next: HttpHandler
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<HttpEvent<any>> {
    const token = this.dataStore.token()?.tokenString;

    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(authRequest);
  }
}
