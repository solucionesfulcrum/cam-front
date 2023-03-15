import { HttpClient, HttpParams } from '@angular/common/http';
import { Asegurado } from './../_model/asegurado';
import { CRUDService } from './crud.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AseguradoService extends CRUDService<Asegurado>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/asegurados`
    )
   }

   findByTipoDocAndNumDoc(tipoDoc: number, numDoc: string){
    let params = new HttpParams()
    .set('tipoDoc', tipoDoc)
    .set('numDoc', numDoc);
    let url = `${environment.HOST}/asegurados/buscar?${params}`;
    return this._http.get<Asegurado>(url);
   }
}
