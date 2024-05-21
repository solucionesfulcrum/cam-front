import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  
  getListAsistencia() {
    const payload = {
      idProgDet: JSON.parse(localStorage.getItem('idProgramElegida')!),
      pageNum : 1,
      pageSize: 100
    }
    const url = `${URL_BASE}/listar/AsistenciaIncripcion`;
    return this._httpClient.post<any>(url, payload);
  }


  getListAsegurados() {
    const payload = {
      idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      texto : ''
    }
    const url = `${environment.API}/asegurado/buscar/nombres`;
    return this._httpClient.post<any>(url, payload);
  }

  registrarAsistencia(payload: {idAsegurado: string, idProgramacionSubDet: string} ) {
    const url = `${URL_BASE}/registrar/asistencia`;
    return this._httpClient.post<any>(url, payload);
  }

  registrarInscripcion(payload: {
    idFichaAdmision: string,
    idUnidadOperativa: string,
    idProgramacionDet: string,
    acreditado: boolean,
    idUsuarioReg: string
  }) 
  {
    const url = `${URL_BASE}/inscripcion/registrar`;
    return this._httpClient.post<any>(url, payload);
  }

  listarAsistencia(payload: {
    idProgDet: string,
    pageNum: number,
    pageSize: number
  }
   ){

    const url = `${URL_BASE}/listar/AsistenciaIncripcion`;
    return this._httpClient.post<any>(url, payload);

  }

  eliminarRegistrados(lista : number[]){
    const url = `${URL_BASE}/inscripcion/eliminar`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(lista) // Convertimos el array de números en formato JSON
    };

    return this._httpClient.delete<any>(url, httpOptions);
  }

  //control/inscripcion/registrar
}
