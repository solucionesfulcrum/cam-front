import { HttpClient } from '@angular/common/http';
import { RelacionesCriram } from './../_model/relaciones-criram';
import { CRUDService } from './crud.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RelacionesCiramService extends CRUDService<RelacionesCriram>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/relaciones-ciram`
    )
   }

   buscarPorUnidadOpePadre(idUnidadOperativaPadre: number){
    let url = `${environment.HOST}/relaciones-ciram/buscar-padre/${idUnidadOperativaPadre}`;
    return this._http.get<RelacionesCriram[]>(url);
   }
}
