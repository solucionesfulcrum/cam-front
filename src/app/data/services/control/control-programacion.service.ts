import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { RequestBuscarApto } from '@models/control/asistencia/crud-asistencia.model';

const URL_BASE = `${environment.API}/control`;

@Injectable({
  providedIn: 'root'
})
export class ControlProgramacionService {

  constructor(private _httpClient: HttpClient) { }

  getlistaProgramacion(idUnidadOpe: number,fechInicio: string, fechFin: string, texto: string) {
    const url = `${environment.API}/programacion/obtener/lista/usuario/?idUnidadOperativa=${idUnidadOpe}&fechInicio=${fechInicio}&fechFin=${fechFin}&texto=${texto}&idUsuario=${(JSON.parse(localStorage.getItem('camUser')!)).idUsuario}`;
    return this._httpClient.get<any>(url);
  }

  getCabeceraProgramacion(idProgDet: number) {
    const url = `${URL_BASE}/obtener/cabecera/asistencia/${idProgDet}`;
    return this._httpClient.get<any>(url);
  }

  getSiEsApto(model: RequestBuscarApto) {
    const url = `${environment.API}/asegurado/buscar/aptos`;
    return this._httpClient.post<any>(url, model);
  }

  getListAsegurados() {
    const payload = {
      idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      texto : ''
    }
    const url = `${environment.API}/asegurado/buscar/nombres`;
    return this._httpClient.post<any>(url, payload);
  }

  registrarAsistencia(model: {idAsegurado: string, idProgramacionSubDet: string} ) {
    const url = `${environment.API}/registrar/asistencia`;
    return this._httpClient.post<any>(url, model);
  }
}
