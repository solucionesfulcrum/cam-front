import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { CambioPass } from 'src/app/core/_model/auth/cambioPassword';
import { Logueo, LogueoResponse } from 'src/app/core/_model/auth/login';
import {
  CompletoRegistro,
  RegistroUsuario,
  ResponseRegistro,
} from 'src/app/core/_model/auth/registro';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

const helperJWT = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private logueado = new BehaviorSubject<boolean>(false);

  get isLogged(): Observable<boolean> {
    return this.logueado.asObservable();
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.checkToken();
  }

  login(data: Logueo): Observable<LogueoResponse> {
    const params = this._authBasic();
    return this.http
      .post<LogueoResponse>(`${environment.authApi}/login`, data, {
        params,
      })
      .pipe(
        map((logueo: LogueoResponse) => {
          const decodedToken = helperJWT.decodeToken(logueo.accessToken);
          this.logueado.next(true);
          this.guardarLocalStorage(logueo.accessToken);
          return logueo;
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.logueado.next(false);
    this.router.navigate(['/']);
  }

  registrarUsuario(data: RegistroUsuario) {
    const params = this._authBasic();
    return this.http
      .post(`${environment.authApi}/pre-register`, data, {
        params,
        responseType: 'text' as const,
      })
      .pipe(catchError(this.handleError));
  }

  completarRegistro(data: CompletoRegistro): Observable<any> {
    const params = this._authBasic();
    return this.http
      .post<any>(`${environment.authApi}/register`, data, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  preCambiarPassword(data: any) {
    const params = this._authBasic();
    return this.http
      .post(`${environment.authApi}/pre-recover-password`, data, {
        params,
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  cambiarPassword(data: CambioPass) {
    return this.http
      .post(`${environment.authApi}/recover-password`, data)
      .pipe(catchError(this.handleError));
  }

  private guardarLocalStorage(token: string): void {
    const decodedToken = helperJWT.decodeToken(token);
    const data = {
      token,
      guiid: decodedToken.sub,
      roles: decodedToken.roles,
    };
    localStorage.setItem('usuario', JSON.stringify(data));
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

  private _authBasic() {
    const params = new HttpParams().set(
      'g',
      '1ddd7536-e95e-479e-9571-d820dc583d89'
    );
    return params;
  }

  handleError(error: any): Observable<never> {
    let errorMensaje = 'Error desconocido';
    if (error) {
      errorMensaje = error.error;
    }
    return throwError(() => errorMensaje);
  }

  isLogin() {
    const res =  !!localStorage.getItem('usuario');
    console.log("isLogin ... ", res)
    return res 
  }

}
