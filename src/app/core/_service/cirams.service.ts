import { HttpClient } from '@angular/common/http';
import { CRUDService } from './crud.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Ciram } from '../_model/ciram.model';

@Injectable({
  providedIn: 'root'
})
export class CiramsService extends CRUDService<Ciram>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/ciram`
    )
   }

  getCiramsByCam( idCam: string){
    let url = `${environment.HOST}/ciram/buscarPorIdCam/${idCam}`;
    return this._http.get<any>(url);
   }

  getUsuariosByCiram( idCiram: string ){
    let url = `${environment.HOST}/usuario/unidad/3/${idCiram}`;
    return this._http.get<any>(url);
   }


}