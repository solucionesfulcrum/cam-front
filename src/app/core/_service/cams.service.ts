import { HttpClient } from '@angular/common/http';
import { Cam } from './../_model/cam.model';
import { CRUDService } from './crud.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CamsService extends CRUDService<Cam>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/cam`
    )
   }

  getUsuariosByCam( idCam: string){
    let url = `${environment.HOST}/usuario/unidad/2/${idCam}`;
    return this._http.get<any>(url);
   }

}