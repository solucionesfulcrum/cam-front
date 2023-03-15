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
}