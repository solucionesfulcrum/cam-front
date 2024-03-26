import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { TokenService } from '@services/token.service';
import { ResponseLogin, ResponseLoginSSO } from '@models/response-login.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { iUser } from '../interfaces/user.interface';
import { User } from '@models/user.model';
import { UserService } from '@shared/stores/user.service';
import { RequestRegisterSIGPS } from '@models/auth/register.model';
import { PreRecoverPassword, RecoverPassword } from '@models/auth/recover-pass.model';
import { listardashboardRequest,listardashboardRequestActivos } from '@models/dashboard/dashboard.model'
const helperJWT = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth_api = environment.API + '/auth';
  decodedToken:string | null = '' ;

  private userSSO$= new BehaviorSubject<boolean>(false);

  get isLogged(): Observable<boolean> {
    return this.userSSO$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private _userService:UserService) {}

  private _authBasic() {
    const params = new HttpParams().set(
      'g',
      '4440d2e2-1eae-4617-a0c2-0e3824a5e875'
    );
    return params;
  }

  /*
  login2(username: string, password: string) {
    //for back
    return this.http
      .post<ResponseLogin>(`${this.auth_api}/login`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          this.tokenService.saveToken(response.data.auth.accessToken);
          this.tokenService.saveRefreshToken(response.data.auth.refreshToken);

          this.user$.next(response.data.data);
          console.log('this.user$: ', this.user$);
        })
      );
  }
  */

  getProfile(): Observable<User> {
    const token = this.tokenService.getToken()
    this.decodedToken = helperJWT.decodeToken(token!);
    const params = this._authBasic();
    return this.http
      .post<iUser>(
        `${environment.API}/auth/usuario/info`,
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
  }

  login(username: string, password: string): Observable<ResponseLoginSSO> {
    //for sso
    const params = this._authBasic();
    return this.http
      .post<ResponseLoginSSO>(
        `${environment.API}/auth/login`,
        { username, password },
        {
          params,
        }
      )
      .pipe(
        map(  (rta: ResponseLoginSSO) => {
          this.decodedToken = helperJWT.decodeToken(rta.data.accessToken);
          this.tokenService.saveToken(rta.data.accessToken);
          this.tokenService.saveRefreshToken(rta.data.refreshToken);
          this.userSSO$.next(true);
          this.getProfile();
          return rta;
        }),
        catchError(this.handleError)
      );
  }

  register(
    tipoDoc: string,
    doc: string,
    names: string,
    email: string,
    password: string,
    codigoPlanilla: string
  ) {
    return this.http.post<any>(`${this.auth_api}/pre-register`, {
      tipDocIden: tipoDoc,
      numDocIden: doc,
      password: password,
      email: email,
      nombres: names,
      codigoPlanilla: codigoPlanilla,
    });
  }

  preRecoverPassword(model: PreRecoverPassword){
    const url = `${environment.API}/auth/pre-recover-password`;
    return this.http.post<any>(url, model);
  }

  recoverPassword(model: RecoverPassword){
    const url = `${environment.API}/auth/recover-password`;
    return this.http.post<any>(url, model);
  }

  registerSIGPS(model: RequestRegisterSIGPS) {
    const url = `${environment.API}/usuario/registrar`;
    return this.http.post<any>(url, model);
  }

  confirmEmailSIGPS(guiid: string) {
    const url = `${environment.API}/usuario/confirmar/email`;
    return this.http.post<any>(url, {guiidSso: guiid});
  }
  /*
  registerAndLogin(name:string, email:string, password:string )|
  {
    return this.register(name, email, password)
    .pipe(
      switchMap(()=>
        this.login(email, password)
      )
    )
  }
  */

  validateCode(code: string, genWithCode: string, numdoc: string) {
    return this.http.post<{ code: number; message: string; data: string }>(
      `${this.auth_api}/register`,
      {
        guiid: genWithCode,
        numDocIden: numdoc,
        codigo: code,
      }
    );
  }

  isAvailable(email: string) {
    return this.http.post<{ isAvailable: boolean }>(
      `${this.auth_api}/api/v1/auth/is-available`,
      {
        email,
      }
    );
  }

  recovery(email: string) {
    return this.http.post(`${this.auth_api}/api/v1/auth/recovery`, { email });
  }

  changePassword(token: string, newPassword: string) {
    return this.http.post(`${this.auth_api}/api/v1/auth/change-password`, {
      token,
      newPassword,
    });
  }

  logout() {
    this.tokenService.removeToken();
    localStorage.removeItem('camUser');
    localStorage.removeItem('UnidElegida');
    this.tokenService.removeRefreshToken();
  }



  refreshToken(refreshToken: string) {
    return this.http
      .post<ResponseLogin>(`${this.auth_api}/api/v1/auth/refresh-token`, {
        refreshToken,
      })
      .pipe(
        tap((response) => {
          this.tokenService.saveToken(response.data.auth.accessToken);
          this.tokenService.saveRefreshToken(response.data.auth.refreshToken);
        })
      );
  }

  handleError(error: any): Observable<never> {
    let errorMensaje = 'Error desconocido';
    if (error) {
      errorMensaje = error.error;
    }
    return throwError(() => errorMensaje);
  }
  //Servicios de dashboard deben ser migrados a dasboard.service.ts esto es temporal.
  listarDashboard(model: listardashboardRequest) {
    const url = `${environment.API}/asegurado/listar/dashboard`;
    return this.http.post<any>(url, model);
  }

  listarDashboardActivos(model: listardashboardRequestActivos) {
    const url = `${environment.API}/asegurado/listar/dashboard/estado`;
    return this.http.post<any>(url, model);
  }
}
