import { HttpClient } from '@angular/common/http';
import { Programa } from '../_model/programa.model';
import { CRUDService } from './crud.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramasService extends CRUDService<Programa>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/programa`
    )
   }
}
