import { HttpClient, HttpParams } from '@angular/common/http';
import { Usuario } from './../_model/usuario';
import { CRUDService } from './crud.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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

  findByTipoDocAndNumDoc(tipoDoc: number, numDoc: string){
    let params = new HttpParams()
    .set('tipoDoc', tipoDoc)
    .set('numDoc', numDoc);
    let url = `${environment.HOST}/asegurados/buscar?${params}`;
    return this._http.get<Usuario>(url);
   }

   getUsuarioFromSys(id:string ){
      return this._http.get<any>(`${environment.HOST}/usuario/idsso/${id}`);
   }

}
