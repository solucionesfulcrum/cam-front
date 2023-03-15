import { CRUDService } from './crud.service';
import { Perfiles } from './../_model/perfiles';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilesService extends CRUDService<Perfiles>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/perfiles`
    )
   }
}
