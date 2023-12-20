import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestListaSolicitudesAfiliados } from '@models/afiliados/ficha-solicitud.model';
import { environment } from 'src/environments/environment';

const URL_BASE = `${environment.HOST}/afiliado`;

@Injectable({
  providedIn: 'root'
})
export class AfiliacionesSolicitudesService {

  constructor(private _httpClient: HttpClient) { }

  getListaSolicitudes(model: RequestListaSolicitudesAfiliados){
    const url = `${URL_BASE}/lista-solicitudes`;
    return this._httpClient.post<any>(url, model);
  }
}
