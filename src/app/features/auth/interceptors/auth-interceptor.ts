import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth-service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(

    private authService: AuthService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!request.url.includes('/auth/login')) {
      const newRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${this.authService.AccessToken}`),
      });
      return next.handle(newRequest);
    }else{
      return next.handle(request);
    }
  }
}
