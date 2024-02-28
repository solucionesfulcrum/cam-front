import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterSolicitud } from '@models/afiliaciones/register-afiliacion.model';
import { RequestListaSAfiliadosContacto, RequestListaSolicitudesAfiliados,listaConstactosRequest } from '@models/afiliados/ficha-solicitud.model';
import { environment } from 'src/environments/environment';

const URL_BASE = `${environment.API}/afiliado`;
const api_URL = environment.API

@Injectable({
  providedIn: 'root'
})
export class AfiliacionesSolicitudesService {

  constructor(private _httpClient: HttpClient) { }

  getListaSolicitudes(model: RequestListaSolicitudesAfiliados){
    const url = `${environment.API}/solicitud/listar`;
    return this._httpClient.post<any>(url, model);
  }

  registerSolicitudAsegurado(model: RegisterSolicitud){
    const url = `${environment.API}/solicitud/registrar`;
    return this._httpClient.post<any>(url, model);
  }

  getListaAfiliados(model: RequestListaSAfiliadosContacto){
    const url = `${URL_BASE}/lista-afiliados`;
    return this._httpClient.post<any>(url, model);
  }

  getListaContacto(model: listaConstactosRequest){
    const url = `${api_URL}/ficha-admision/listar`;
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
