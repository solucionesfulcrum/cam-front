import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestListaSAfiliadosContacto, RequestListaSolicitudesAfiliados } from '@models/afiliados/ficha-solicitud.model';
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

  getListaAfiliados(model: RequestListaSAfiliadosContacto){
    const url = `${URL_BASE}/lista-afiliados`;
    return this._httpClient.post<any>(url, model);
  }

  getDataSolicitud(tipoDoc: string, numDoc: string){
    const url = `${URL_BASE}/ficha-solicitud?tipDoc=${tipoDoc}&numDoc=${numDoc}`;
    return this._httpClient.get<any>(url);
  }

  getDataAfiliado(tipoDoc: string, numDoc: string){
    const url = `${URL_BASE}/ficha-afiliado?tipDoc=${tipoDoc}&numDoc=${numDoc}`;
    return this._httpClient.get<any>(url);
  }
}
