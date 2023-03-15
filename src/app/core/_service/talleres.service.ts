import { HttpClient } from '@angular/common/http';
import { Talleres } from './../_model/talleres';
import { CRUDService } from './crud.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TalleresService extends CRUDService<Talleres>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/talleres`
    )
   }
}
