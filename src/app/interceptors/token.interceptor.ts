import { Injectable } from '@angular/core';
import { TokenService } from '@services/token.service';
import { AuthService } from '@services/auth.service';
import { HttpContextToken, HttpContext } from '@angular/common/http';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

const CHECK_TOKEN = new HttpContextToken<boolean>(()=>false);
export function checkToken(){
  return new HttpContext().set(CHECK_TOKEN, true)
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {


  constructor( private tokenService: TokenService, private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //return this.injectToken(request,next)
    if ( request.context.get(CHECK_TOKEN)){
      const isValidToken = this.tokenService.isValidToken() //access-token
      if(isValidToken)
        return this.injectToken(request, next)
      return this.updateAccessTokenByRefreshToken(request, next)
    }
    return next.handle(request)
  }

  private injectToken( request: HttpRequest<unknown>, next: HttpHandler )
  {
    const accessToken = this.tokenService.getToken()
    if ( accessToken ){
      const authRequest = request.clone({
        headers: request.headers.set('Authorization',`Bearer ${accessToken}`) 
      })
      return next.handle(authRequest)
    }
    return next.handle(request)
  }

  private updateAccessTokenByRefreshToken ( request: HttpRequest<unknown>, next: HttpHandler ){
    const refreshToken = this.tokenService.getRefreshToken();
    const isValidRefreshToken = this.tokenService.isValidRefreshToken()
    if(refreshToken && isValidRefreshToken )
    {
      return this.authService.refreshToken(refreshToken)
      .pipe(
        switchMap( () => this.injectToken(request, next))
      )
    }
    return next.handle(request)
  }
}
