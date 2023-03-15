import { HttpClient, HttpParams } from '@angular/common/http';
import { CRUDService } from './crud.service';
import { Persona } from './../_model/persona';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonaService extends CRUDService<Persona>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/personas`
    )
   }

   findByTipoDocAndNumDoc(tipoDoc: number, numDoc: string){
    let params = new HttpParams()
    .set('tipoDoc', tipoDoc)
    .set('numDoc', numDoc);
    let url = `${environment.HOST}/personas/buscar?${params}`;
    return this._http.get<Persona>(url);
   }
}
