import { HttpClient } from '@angular/common/http';
import { Usuario } from './../_model/usuario';
import { CRUDService } from './crud.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends CRUDService<Usuario>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/usuarios`
    )
   }
}
