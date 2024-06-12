import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {environment } from '@environments/environment'
import {TokenService} from '@services/token.service'
import { checkToken } from '@interceptors/token.interceptor';
import { iUser } from '../interfaces/user.interface';
import { Observable, map } from 'rxjs';
import { User } from '@models/user.model';
import { List } from '../interfaces/list.interface';
import { iUserTable } from '../interfaces/user-table.interface';
import { ActivateUserSSO, ActivateUserSigps, RequestListUsers } from '@models/usuario/user.model';
import { authKey } from '@environments/auth.keys';

interface Environment {
  API: string;
}

interface AuthKey {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _authBasic() {
    let environment_ : Environment = environment;
    let authKey_ : AuthKey = authKey;

    const params = new HttpParams().set(
      'g',
      authKey_[(environment_.API)]
    );
    return params;
  }
  api_URL = environment.API
  constructor( private http: HttpClient, private tokenService:TokenService) { }

  getUserSessionActive(guiid: string){
    const url = `${this.api_URL}/usuario/login/data/${guiid}`;
    return this.http.get<any>(url);
  }

  listUsersSigps(model: RequestListUsers){
    const url = `${this.api_URL}/usuario/listar`;
    return this.http.post<any>(url,model);
  }

  activateUserSigps(model: ActivateUserSigps){
    const url = `${this.api_URL}/usuario/activate`;
    return this.http.post<any>(url,model);
  }

  // activateUserSSO(model: ActivateUserSSO){
  //   const params = this._authBasic();
  //   console.log(checkToken())
  //   const url = `${environment.SSO_API}/vigencia/registrar`;
  //   return this.http.post<any>(url,model,{
  //     params,
  //     context:checkToken()
  //   });
  // }

  getUser(idUser: string){
    const url = `${this.api_URL}/usuario/${idUser}`;
    return this.http.get<any>(url);
  }

  getActivacionesUser(idUser: string){
    const url = `${this.api_URL}/unidad-operativa/activas/usuario/${idUser}`;
    return this.http.get<any>(url);
  }

  getInformacionActivaciones(idUser: number){
    const url = `${this.api_URL}/usuario/listar/activaciones/${idUser}`;
    return this.http.get<any>(url);
  }

  getActivacionActiva(idUsuario: number){
    let idUnidadOperativaUser = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;
    const url = `${this.api_URL}/profesional/ultima-activacion?usuarioId=${idUsuario}&unidadOperativaId=${idUnidadOperativaUser}`;
    return this.http.get<any>(url);
  }

  //-------------------------------------------------------------------------------------------------------------
  // getUsers(body:any){
  //   //const token = this.tokenService.getToken()
  //   const params = this._authBasic();
  //   return this.http.post<List<iUserTable>>(`${environment.SSO_API}/usuario/listar`,body,{
  //     params,
  //     context:checkToken()
  //   })
  // }
  // getUserInfo(guiid:string):Observable<User>{
  //   //const token = this.tokenService.getToken()
  //   const params = this._authBasic();
  //   return this.http.post<any>(`${environment.SSO_API}/usuario/getUserInfo`,{
  //     guiid
  //   },{
  //     params,
  //     context:checkToken()
  //   }).pipe(
  //     map(res=>{
  //       return new User(res);
  //     })
  //   );
  // }

}
