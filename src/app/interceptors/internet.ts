import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConnectionService } from '@services/connection.service';

@Injectable()
export class NoInternetInterceptor implements HttpInterceptor {

  constructor(private connectionService: ConnectionService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!navigator.onLine || error.status === 0) {
         this.connectionService.updateConnectionStatus(false);
        }
        return throwError(error);
      })
    );
  }
}