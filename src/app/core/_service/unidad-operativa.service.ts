import { CRUDService } from './crud.service';
import { UnidadOperativa } from './../_model/unidad-operativa';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnidadOperativaService extends CRUDService<UnidadOperativa>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/unidad-operativa`
    )
   }

   obtenerUnidadesOperativasPadres(){
    let url = `${environment.HOST}/unidad-operativa/unidades-operativas-padres`
    return this._http.get<UnidadOperativa[]>(url);
   }

   obtenerUnidadesOperativasHijas(idUnidadOperativaPadre: number){
    let url = `${environment.HOST}/unidad-operativa/unidades-operativas-hijas/${idUnidadOperativaPadre}`
    return this._http.get<UnidadOperativa[]>(url);
   }
}
