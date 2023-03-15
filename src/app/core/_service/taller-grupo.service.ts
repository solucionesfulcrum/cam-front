import { HttpClient } from '@angular/common/http';
import { Tallergrupo } from './../_model/tallergrupo';
import { CRUDService } from './crud.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TallerGrupoService extends CRUDService<Tallergrupo> {

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/taller-grupo`
    )
   }
}
