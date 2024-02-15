import { HttpClient, HttpParams } from '@angular/common/http';
import { Usuario } from './../_model/usuario';
import { CRUDService } from './crud.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivateUser } from '@models/usuario/user/user.module';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends CRUDService<Usuario>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/usuarios`
    )
  }

  findByTipoDocAndNumDoc(tipoDoc: number, numDoc: string) {
    let params = new HttpParams()
      .set('tipoDoc', tipoDoc)
      .set('numDoc', numDoc);
    let url = `${environment.HOST}/asegurados/buscar?${params}`;
    return this._http.get<Usuario>(url);
  }

  getUsuarioFromSys(id: string) {
    return this._http.get<any>(`${environment.HOST}/usuario/${id}`);
  }

  getUnidadOperativaActiva(id: string) {
    return this._http.get<any>(`${environment.HOST}/unidad-operativa/activas/usuario/${id}`);
  }

  /*-----ROLES------*/

  getListRolesActivos() {
    return this._http.get<any>(`${environment.HOST}/roles/listar/activos`);
  }
   /*-----LISTA UO------*/
  getUnidadesOperativas () {
    return this._http.get<any>(`${environment.HOST}/unidad-operativa/listar/CAM?texto=`);
  }
  ///*------Activar Usuario---*/

  activateUser(model: ActivateUser){
    const url = `${environment.HOST}/usuario/activate`;
    return this._http.post<any>(url,model,{
    });
  }
}