import { Injectable, isDevMode } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (isDevMode() && request.url.startsWith("/api") ) {

      return next.handle(request.clone({ url: `http://localhost:8080${request.url}` }));
    } else {
      return next.handle(request);
    }

  }
}
