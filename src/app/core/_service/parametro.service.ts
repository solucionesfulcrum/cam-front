import { CRUDService } from './crud.service';
import { Parametro } from './../_model/parametro';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametroService extends CRUDService<Parametro>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/parametros`
    )
   }

   listarModalidades(){
    let idParametro = 5; // id del parametro en base de datos
    let url = `${environment.HOST}/parametros/id-padre/${idParametro}`
    return this._http.get<Parametro[]>(url);
   }

   listarTipoDocumento(){
    let idParametro = 1; // id del parametro en base de datos
    let url = `${environment.HOST}/parametros/id-padre/${idParametro}`
    return this._http.get<Parametro[]>(url);
   }
}
