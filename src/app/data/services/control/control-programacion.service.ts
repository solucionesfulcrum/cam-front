import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

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
}
