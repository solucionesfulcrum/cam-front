import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConnectionService } from '@services/connection.service';

@Injectable()
export class NoInternetInterceptor implements HttpInterceptor {

  constructor(private connectionService: ConnectionService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verificar si la solicitud tiene el encabezado 'Skip-Interceptor'
    if (request.urlWithParams.includes('skipInterceptor=true')) {
      console.log('Interceptor omitido para esta solicitud');
      return next.handle(request);
    }

    // Manejo normal de la solicitud si no tiene el encabezado 'Skip-Interceptor'
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!navigator.onLine || error.status === 0) {
          this.connectionService.updateConnectionStatus(false);
        }

        // Verificar si el error es "chunk loading failed"
        if (error.message && error.message.includes('chunk loading failed')) {
          // Tomar medidas específicas, como recargar la página
          this.connectionService.updateConnectionStatus(false);
          window.location.reload();
        }

        return throwError(error);
      })
    );
  }
}
