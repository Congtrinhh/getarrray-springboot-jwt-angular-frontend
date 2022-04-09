import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const loginUrl = `${this.authenticationService.host}/user/login`,
    registerUrl = `${this.authenticationService.host}/user/register`,
    resetPasswordUrl = `${this.authenticationService.host}/user/resetpassword`;
    if (
      request.url.includes(loginUrl) ||
      request.url.includes(registerUrl) ||
      request.url.includes(resetPasswordUrl)
    ) {
      return next.handle(request);
    } 
    this.authenticationService.loadToken();
    const token = this.authenticationService.getToken();
    if (token) {
      const clonedRequest = request.clone({setHeaders: {Authorization: `Bearer ${token}`}})
      return next.handle(clonedRequest)
    }
    return next.handle(request);
  }
}
