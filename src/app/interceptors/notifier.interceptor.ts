import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NotificationService } from '@services/notification.service';

@Injectable()
export class NotifierInterceptor implements HttpInterceptor {

  constructor(private _notification: NotificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Verificar si la solicitud tiene el encabezado 'Skip-Interceptor'
    if (request.urlWithParams.includes('skipInterceptor=true')) {
      console.log('Interceptor omitido para esta solicitud');
      return next.handle(request);
    }

    // Manejo normal de la solicitud si no tiene el encabezado 'Skip-Interceptor'
    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        switch (response.status) {
          case 0:
            this._notification.error(
              'No se pudo acceder al servidor. Verifique su conexión a internet.'
            );
            break;
          case HttpStatusCode.BadRequest:
            const message = response?.error?.message;
            if (message) {
              this._notification.warning(message);
            }
            break;
          case HttpStatusCode.InternalServerError:
            this._notification.error('Error al procesar información.');
            break;
          case HttpStatusCode.NotFound:
            // TODO: Redireccionar a página 404
            this._notification.error('Recurso no encontrado.');
            break;
        }
        return throwError(response);
      })
    );
  }
}
