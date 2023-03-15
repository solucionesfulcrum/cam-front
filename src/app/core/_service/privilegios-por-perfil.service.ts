import { HttpClient } from '@angular/common/http';
import { CRUDService } from './crud.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrivilegiosPorPerfilService extends CRUDService<PrivilegiosPorPerfilService>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/privilegios-por-perfil`
    )
   }
}
