import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

const URL_BASE = `${environment.API}`;

@Injectable({
  providedIn: 'root'
})
export class ContratosAdministracionService {

  constructor(private _httpClient                 : HttpClient) { }

  getListCamById(){
    const url = `${environment.API}/unidad-operativa/listar/cam-ciram?idUnidadOperativa=${(JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa}`;
    return this._httpClient.get<any>(url);
  }
}
