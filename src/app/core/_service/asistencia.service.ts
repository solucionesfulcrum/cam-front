import { HttpClient } from '@angular/common/http';
import { CRUDService } from './crud.service';
import { Asistencia } from './../_model/asistencia';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService extends CRUDService<Asistencia>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/asistencias`
    )
   }

}
