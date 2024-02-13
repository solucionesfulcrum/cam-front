import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
import { RegistroUsuarioForSistema } from 'src/app/core/_model/auth/registroForSistema';

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
    console.log("data login", data)
    const params = this._authBasic();
    console.log("params", params)
    return this.http
      .post<LogueoResponse>(`${environment.HOST}/auth/login`, data, {
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
      .post(`${environment.HOST}/auth/pre-register`, data, {
        params,
        responseType: 'text' as const,
      })
      .pipe(catchError(this.handleError));
  }

  completarRegistro(data: CompletoRegistro): Observable<any> {
    const params = this._authBasic();
    return this.http
      .post<any>(`${environment.HOST}/auth/register`, data, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  createUserForSistema(data: RegistroUsuarioForSistema): Observable<any> {
    console.log("data de resgistro formulario", data)
    return this.http
      .post<any>(`${environment.HOST}/usuario/registrar`, {
        categoria: "CAM",
        correo: data.correo,
        tipoDoc: data.tipoDoc,
        numDoc: data.numDoc,
        nombres: data.nombres,
        codPlanilla: data.codPlanilla,
        unidOperativaId: data.unidadOperativaId,
        guiidSso: data.guiidSso

      })
      .pipe(catchError(this.handleError));
  }

  //LISTAR UNIDADES OPERATIVAS

  getUnidadesOperativas(): Observable<any> {
    return this.http
      .get<any>(`${environment.HOST}/unidad-operativa/listar/CAM?texto=`)
      .pipe(catchError(this.handleError));
  }

  getUsuarioFromSistema(gui: string): Observable<any> {
    return this.http
      .get<any>(`${environment.HOST}/usuario/idsso/` + gui)
      .pipe(catchError(this.handleError));
  }

  /*
  getProfile(): Observable<User> {
    const token = this.tokenService.getToken()
    this.decodedToken = helperJWT.decodeToken(token!);
    const params = this._authBasic();
    return this.http
      .post<iUser>(
        `${environment.SSO_API}/usuario/getUserInfo`,
        {
          "guiid": this.decodedToken?.sub
        },
        {
          params,
          //responseType: 'text' as const,
          headers:{ Authorization: `Bearer ${token}`}
        },
      )
      .pipe(
        map(res=>{
          this._userService.decodeUser = res;
          return new User(res);
        })
      );
  }*/

  postUsuarioFromSistema(data: any): Observable<any> {
    const dataOp = {
      "token": data.accessToken,
      "guiid": data.id
    }
    return this.http
      .post(`${environment.HOST}/auth/usuario/info`, dataOp,
      )
      .pipe(catchError(this.handleError));
      
  }

  preCambiarPassword(data: any) {
    const params = this._authBasic();
    return this.http
      .post(`${environment.HOST}/auth/pre-recover-password`, data, {
        params,
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  cambiarPassword(data: CambioPass) {
    return this.http
      .post(`${environment.HOST}/auth/recover-password`, data)
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

  guardarLocalStorageForSistema(data: any): void {
    localStorage.setItem('dataCam', data);
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

  isValidToken(): boolean {
    const localUsuario = localStorage.getItem('usuario');
    if (localUsuario) {
      const usuario = JSON.parse(localUsuario as string);
      const isExpired = helperJWT.isTokenExpired(usuario.token);
      if (isExpired) {
        return false;
      } else {
        return true;
      }
    }
    return false;
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
  getUsuariosAppFromSSO(pageNum: number, pageSize: number) {
    //let paramsTMP = new HttpParams().set('g', '1fd720df-c793-4039-8be7-44351edd7820' )
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token
    const data = {
      "pageNum": pageNum,
      "pageSize": pageSize, //PREGUNTAR SSO - funciona envando 20, set 1, y solo envia 1 registro
      "estado": 1 //PREGUNTAR AL SSO
    }
    return this.http
      .post<any>(`${environment.HOST}/usuario-app/listar`,
        data,
        {
          params,
          headers: { Authorization: `Bearer ${token}` }
        },
      )
      .pipe(catchError(this.handleError));
  }

  registrarUsuarioAppFromSSO(guiid: string) {
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token
    const data = {
      "guiid": guiid,
      "idRolAplicacion": 5, //PREGUNTAR AL SSO
    }
    return this.http
      .post(`${environment.HOST}/usuario-app/registrar`,
        data,
        {
          params,
          responseType: 'text' as const,
          headers: { Authorization: `Bearer ${token}` }
        },
      )
      .pipe(catchError(this.handleError));
  }

  eliminarUsuarioAppFromSSO(guiid: string) {
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token
    const options =
    {
      Headers: {
        params,
        headers: { Authorization: `Bearer ${token}` }
      },
      body: {
        "guiid": guiid
      }
    }
    return this.http
      .delete(`${environment.HOST}/usuario-app/delete`,
        options
      )
      .pipe(catchError(this.handleError));
  }


  // SERVICIO VIGENCIA SSO
  getVigenciasFromSSO(pageNum: number, pageSize: number) {
    //let paramsTMP = new HttpParams().set('g', '1fd720df-c793-4039-8be7-44351edd7820' )
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token
    const data = {
      "pageNum": pageNum,
      "pageSize": pageSize,
      "estado": 1
    }
    return this.http
      .post(`${environment.HOST}/vigencia/listar`,
        data,
        {
          params,
          responseType: 'text' as const,
          headers: { Authorization: `Bearer ${token}` }
        },
      )
      .pipe(catchError(this.handleError));
  }

  registrarVigenciaFromSSO(guiid: string, fechaInicio: string, fechaFin: string, observacion: string) {
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token
    const data = {
      "guiid": guiid,
      "fechaInicio": fechaInicio,
      "fechaFin": fechaFin,
      "observacion": observacion,
    }
    return this.http
      .post(`${environment.HOST}/vigencia/registrar`,
        data,
        {
          params,
          responseType: 'text' as const,
          headers: { Authorization: `Bearer ${token}` }
        },
      )
      .pipe(catchError(this.handleError));
  }

  actualizarVigenciaFromSSO(guiid: string, idUsuarioVigencia: string, fechaInicio: string, fechaFin: string, observacion: string) {
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token
    const data = {
      "idUsuarioVigencia": idUsuarioVigencia,
      "guiid": guiid,
      "fechaInicio": fechaInicio,
      "fechaFin": fechaFin,
      "observacion": observacion,
    }
    return this.http
      .post(`${environment.HOST}/vigencia/actualizar`,
        data,
        {
          params,
          responseType: 'text' as const,
          headers: { Authorization: `Bearer ${token}` }
        },
      )
      .pipe(catchError(this.handleError));
  }

  // SERVICIO ROLES SSO
  getRolesFromSSO(pageNum: number, pageSize: number) {
    //let paramsTMP = new HttpParams().set('g', '1fd720df-c793-4039-8be7-44351edd7820' )
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token
    const data = {
      "pageNum": pageNum,
      "pageSize": pageSize,
      "estado": 1  // PREGUNTAR AL BACK SSO
    }
    return this.http
      .post(`${environment.HOST}/rol-app/listar`,
        data,
        {
          params,
          responseType: 'text' as const,
          headers: { Authorization: `Bearer ${token}` }
        },
      )
      .pipe(catchError(this.handleError));
  }

  registrarRolesFromSSO(codigo: string, nombre: string) {
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token
    const data = {
      "codigo": codigo,
      "nombre": nombre,
    }
    return this.http
      .post(`${environment.HOST}/rol-app/registrar`,
        data,
        {
          params,
          responseType: 'text' as const,
          headers: { Authorization: `Bearer ${token}` }
        },
      )
      .pipe(catchError(this.handleError));
  }

  actualizarRolesFromSSO(idRolAplicacion: string, nombre: string, codigo: string) {
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token
    const data = {
      "idRolAplicacion": idRolAplicacion,
      "nombre": nombre,
      "codigo": codigo,
    }
    return this.http
      .post(`${environment.HOST}/rol-app/actualizar`,
        data,
        {
          params,
          responseType: 'text' as const,
          headers: { Authorization: `Bearer ${token}` }
        },
      )
      .pipe(catchError(this.handleError));
  }

  // SERVICIOS USUARIOS SSO
  getUserInfoSessionFromSSO(pageNum: number, pageSize: number) {
    //let paramsTMP = new HttpParams().set('g', '1fd720df-c793-4039-8be7-44351edd7820' )
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token
    const guiid = dataUsuario.guiid
    const data = {
      "guiid": guiid,
    }
    return this.http
      .post<any>(`${environment.HOST}/usuario/getUserInfo`,
        data,
        {
          params,
          headers: { Authorization: `Bearer ${token}` }
        },
      )
      .pipe(catchError(this.handleError));
  }

  updateUserInfoFromSSO(body: any) {
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token
    const guiid = dataUsuario.guiid
    const data = {
      body,
      "guiid": guiid,
    }
    return this.http
      .post<any>(`${environment.HOST}/usuario/listar`,
        data,
        {
          params,
          headers: { Authorization: `Bearer ${token}` }
        },
      )
      .pipe(catchError(this.handleError));
  }

  getUsuariosFromSSO(pageNum: number, pageSize: number) {
    //let paramsTMP = new HttpParams().set('g', '1fd720df-c793-4039-8be7-44351edd7820' )
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token
    const data = {
      "pageNum": pageNum,
      "pageSize": pageSize, //PREGUNTAR SSO - funciona envando 20, set 1, y solo envia 1 registro
    }
    return this.http
      .post<any>(`${environment.HOST}/usuario/listar`,
        data,
        {
          params,
          headers: { Authorization: `Bearer ${token}` }
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
    const data = {
      "guiid": guiid,
    }
    return this.http
      .post<any>(`${environment.HOST}/usuario/roles`,
        data,
        {
          params,
          headers: { Authorization: `Bearer ${token}` }
        },
      )
      .pipe(catchError(this.handleError));
  }

  asignarRolesForUsuarioFromSSO(guiid: string, roles: string[]) {
    const params = this._authBasic();
    const localUsuario = localStorage.getItem('usuario');
    const dataUsuario = JSON.parse(localUsuario as string);
    const token = dataUsuario.token
    const data = {
      "guiid": guiid,
      roles
    }
    return this.http
      .post(`${environment.HOST}/usuario/asignar-roles`,
        data,
        {
          params,
          responseType: 'text' as const,
          headers: { Authorization: `Bearer ${token}` }
        },
      )
      .pipe(catchError(this.handleError));
  }

}