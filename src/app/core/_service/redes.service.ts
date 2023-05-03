import { HttpClient } from '@angular/common/http';
import { CRUDService } from './crud.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Red } from '../_model/red.model';

@Injectable({
  providedIn: 'root'
})
export class RedesService extends CRUDService<Red>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/red`
    )
   }

   getParametrosClase(nameParametro:string){
    let url = `${environment.HOST}/parametro/clase/${nameParametro}`;
    return this._http.get<any>(url);
   }

  getUsuariosByRed( idRed : string){
    let url = `${environment.HOST}/usuario/unidad/1/${idRed}`;
    return this._http.get<any>(url);
   }

}