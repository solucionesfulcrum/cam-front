import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

const helperJWT = new JwtHelperService();

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ServicesModule { 
  private logueado = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  private checkToken(): void {
    const localUsuario = localStorage.getItem('usuario');
    const usuario = JSON.parse(localUsuario as string);
    if (localUsuario) {
      const isExpired = helperJWT.isTokenExpired(usuario.token);
      if (isExpired) {
        this.logout();
      } else {
        this.logueado.next(true);
      }
    }
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.logueado.next(false);
    this.router.navigate(['/']);
  }

  getUnidadesOperativas(): Observable<any> {
    return this.http
      .get<any>(`${environment.HOST}/unidad-operativa/listar/CAM?texto=`)
      .pipe(catchError(this.handleError));
  }
  
  handleError(error: any): Observable<never> {
    let errorMensaje = 'Error desconocido';
    if (error) {
      errorMensaje = error.error;
    }
    return throwError(() => errorMensaje);
  }

}
