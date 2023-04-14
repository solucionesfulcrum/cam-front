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

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  login(data: Logueo): Observable<LogueoResponse> {
    const params = this._authBasic();
    return this.http
      .post<LogueoResponse>(`${environment.apiSSO}/auth/login`, data, {
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
    console.log('registroUsuario...', data);
    return this.http
      .post(`${environment.apiSSO}/auth/pre-register`, data, {
        params,
        responseType: 'text' as const,
      })
      .pipe(catchError(this.handleError));
  }

  completarRegistro(data: CompletoRegistro): Observable<any> {
    const params = this._authBasic();
    return this.http
      .post<any>(`${environment.apiSSO}/auth/register`, data, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  preCambiarPassword(data: any) {
    const params = this._authBasic();
    return this.http
      .post(`${environment.apiSSO}/auth/pre-recover-password`, data, {
        params,
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  cambiarPassword(data: CambioPass) {
    return this.http
      .post(`${environment.apiSSO}/auth/recover-password`, data)
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
      //'1ddd7536-e95e-479e-9571-d820dc583d89'
      '1fd720df-c793-4039-8be7-44351edd7820'
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
    const res = !!localStorage.getItem('usuario');
    return res;
  }

  // SERVICIOS USUARIOS-APP SSO
  getUsuariosAppFromSSO(pageNum:number, pageSize:number) {
    //let paramsTMP = new HttpParams().set('g', '1fd720df-c793-4039-8be7-44351edd7820' )
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token 
    const data={
      "pageNum": pageNum,
      "pageSize":pageSize, //PREGUNTAR SSO - funciona envando 20, set 1, y solo envia 1 registro
      "estado":1 //PREGUNTAR AL SSO
    }
    return this.http
      .post<any>(`${environment.apiSSO}/usuario-app/listar`, 
      data,
      {
        params,
        headers:{Authorization: `Bearer ${token}`}
      },
      )
      .pipe(catchError(this.handleError));
  }

  registrarUsuarioAppFromSSO(guiid:string){
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token 
    const data={
      "guiid": guiid,
      "idRolAplicacion": 5, //PREGUNTAR AL SSO
    }
    return this.http
      .post(`${environment.apiSSO}/usuario-app/registrar`, 
      data,
      {
        params,
        responseType: 'text' as const,
        headers:{Authorization: `Bearer ${token}`}
      },
      )
      .pipe(catchError(this.handleError));
  }

  eliminarUsuarioAppFromSSO(guiid:string){
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token 
    const options =
    {
      Headers:{
        params,
        headers:{Authorization: `Bearer ${token}`}
      },
      body:{
        "guiid":guiid 
      }
    }
    return this.http
      .delete(`${environment.apiSSO}/usuario-app/delete`, 
        options
      )
      .pipe(catchError(this.handleError));
  }


  // SERVICIO VIGENCIA SSO
  getVigenciasFromSSO(pageNum:number, pageSize:number) {
    //let paramsTMP = new HttpParams().set('g', '1fd720df-c793-4039-8be7-44351edd7820' )
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token 
    const data={
      "pageNum": pageNum,
      "pageSize":pageSize,
      "estado":1
    }
    return this.http
      .post(`${environment.apiSSO}/vigencia/listar`, 
      data,
      {
        params,
        responseType: 'text' as const,
        headers:{Authorization: `Bearer ${token}`}
      },
      )
      .pipe(catchError(this.handleError));
  
}

registrarVigenciaFromSSO(guiid:string, fechaInicio:string, fechaFin:string, observacion:string){
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token 
    const data={
      "guiid": guiid,
      "fechaInicio": fechaInicio, 
      "fechaFin":fechaFin,
      "observacion":observacion,
    }
    return this.http
      .post(`${environment.apiSSO}/vigencia/registrar`, 
      data,
      {
        params,
        responseType: 'text' as const,
        headers:{Authorization: `Bearer ${token}`}
      },
      )
      .pipe(catchError(this.handleError));
  }

  actualizarVigenciaFromSSO(guiid:string, idUsuarioVigencia:string, fechaInicio:string, fechaFin:string, observacion:string){
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token 
    const data={
      "idUsuarioVigencia":idUsuarioVigencia,
      "guiid": guiid,
      "fechaInicio": fechaInicio, 
      "fechaFin":fechaFin,
      "observacion":observacion,
    }
    return this.http
      .post(`${environment.apiSSO}/vigencia/actualizar`, 
      data,
      {
        params,
        responseType: 'text' as const,
        headers:{Authorization: `Bearer ${token}`}
      },
      )
      .pipe(catchError(this.handleError));
  }

  // SERVICIO ROLES SSO
  getRolesFromSSO(pageNum:number, pageSize:number) {
    //let paramsTMP = new HttpParams().set('g', '1fd720df-c793-4039-8be7-44351edd7820' )
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token 
    const data={
      "pageNum": pageNum,
      "pageSize":pageSize,
      "estado":1  // PREGUNTAR AL BACK SSO
    }
    return this.http
      .post(`${environment.apiSSO}/rol-app/listar`, 
      data,
      {
        params,
        responseType: 'text' as const,
        headers:{Authorization: `Bearer ${token}`}
      },
      )
      .pipe(catchError(this.handleError));
}

registrarRolesFromSSO(codigo:string, nombre :string ){
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token 
    const data={
      "codigo":codigo,
      "nombre":nombre,
    }
    return this.http
      .post(`${environment.apiSSO}/rol-app/registrar`, 
      data,
      {
        params,
        responseType: 'text' as const,
        headers:{Authorization: `Bearer ${token}`}
      },
      )
      .pipe(catchError(this.handleError));
  }

  actualizarRolesFromSSO(idRolAplicacion:string, nombre:string, codigo:string){
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token 
    const data={
      "idRolAplicacion": idRolAplicacion, 
      "nombre": nombre,
      "codigo":codigo,
    }
    return this.http
      .post(`${environment.apiSSO}/rol-app/actualizar`, 
      data,
      {
        params,
        responseType: 'text' as const,
        headers:{Authorization: `Bearer ${token}`}
      },
      )
      .pipe(catchError(this.handleError));
  }

  // SERVICIOS USUARIOS SSO
  getUserInfoSessionFromSSO(pageNum:number, pageSize:number) {
    //let paramsTMP = new HttpParams().set('g', '1fd720df-c793-4039-8be7-44351edd7820' )
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token 
    const guiid = dataUsuario.guiid
    const data={
      "guiid": guiid,
    }
    return this.http
      .post<any>(`${environment.apiSSO}/usuario/getUserInfo`, 
      data,
      {
        params,
        headers:{Authorization: `Bearer ${token}`}
      },
      )
      .pipe(catchError(this.handleError));
  }

  updateUserInfoFromSSO(body:any) {
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token 
    const guiid = dataUsuario.guiid
    const data={
      body,
      "guiid": guiid,
    }
    return this.http
      .post<any>(`${environment.apiSSO}/usuario/listar`, 
      data,
      {
        params,
        headers:{Authorization: `Bearer ${token}`}
      },
      )
      .pipe(catchError(this.handleError));
  }

  getUsuariosFromSSO(pageNum:number, pageSize:number) {
    //let paramsTMP = new HttpParams().set('g', '1fd720df-c793-4039-8be7-44351edd7820' )
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token 
    const data={
      "pageNum": pageNum,
      "pageSize":pageSize, //PREGUNTAR SSO - funciona envando 20, set 1, y solo envia 1 registro
    }
    return this.http
      .post<any>(`${environment.apiSSO}/usuario/listar`, 
      data,
      {
        params,
        headers:{Authorization: `Bearer ${token}`}
      },
      )
      .pipe(catchError(this.handleError));
  }

  getRolesForUsuarioFromSSO() {
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token 
    const guiid = dataUsuario.guiid
    const data={
      "guiid": guiid,
    }
    return this.http
      .post<any>(`${environment.apiSSO}/usuario/roles`, 
      data,
      {
        params,
        headers:{Authorization: `Bearer ${token}`}
      },
      )
      .pipe(catchError(this.handleError));
  }

  asignarRolesForUsuarioFromSSO(roles:string[]){
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token 
    const guiid = dataUsuario.guiid
    const data={
      "guiid": guiid,
      roles
    }
    return this.http
      .post(`${environment.apiSSO}/usuario/asignar-roles`, 
      data,
      {
        params,
        responseType: 'text' as const,
        headers:{Authorization: `Bearer ${token}`}
      },
      )
      .pipe(catchError(this.handleError));
  }

}