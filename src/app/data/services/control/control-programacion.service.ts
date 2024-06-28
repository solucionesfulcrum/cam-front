import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { RequestBuscarApto } from '@models/control/asistencia/crud-asistencia.model';
import { RequestCambioHorario, RequestRegisterAsegurado, RequestRegisterAsistio, RequestRegisterCabecera, RequestRegisterDet } from '@models/control/asistencia/service-asistencia.model';

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

  getlistaProgramacionCalendario(idUnidadOpe: number,fechInicio: string, fechFin: string, texto: string) {
    const url = `${environment.API}/programacion/obtener/lista/programacion/?idUnidadOperativa=${idUnidadOpe}&fechInicio=${fechInicio}&fechFin=${fechFin}&texto=${texto}`;
    return this._httpClient.get<any>(url);
  }

  getCabeceraProgramacion(idProgDet: number) {
    const url = `${URL_BASE}/obtener/cabecera/inscripcion/${idProgDet}`;
    return this._httpClient.get<any>(url);
  }

  // Servicios Asistencia -----------------------------------------------------------
  
  registerDataAsistenciaCabecera(model: RequestRegisterCabecera) {
    const url = `${URL_BASE}/asistencia/cab/registrar`;
    return this._httpClient.post<any>(url, model);
  }

  registerAseguradoDetalle(model: RequestRegisterAsegurado){
    const url = `${URL_BASE}/asistencia/sub-det/registrar`;
    return this._httpClient.post<any>(url, model);
  }

  getCabeceraAsistencia(idProgDet: number) {
    const url = `${URL_BASE}/obtener/cabecera/asistencia/${idProgDet}`;
    return this._httpClient.get<any>(url);
  }
  
  getListAsistencia(idProgDet: number) {
    const url = `${URL_BASE}/asistencia/listar/participantes?id-asistencia-det=${idProgDet}`;
    return this._httpClient.get<any>(url);
  }
  
  registerAsistenciaDet(model: RequestRegisterDet) {
    const url = `${URL_BASE}/asistencia/det/registrar`;
    return this._httpClient.post<any>(url, model);
  }

  registerCambioHorario(model: RequestCambioHorario){
    const url = `${URL_BASE}/asistencia/cambio-de-hora`;
    return this._httpClient.post<any>(url, model);
  }

  registerFijarCursor(idControlAsistenciaCab: number, idControlAsistenciaDet: number){
    const url = `${URL_BASE}/asistencia/asistencia-det/fijar-cursor?id-asistencia-cab=${idControlAsistenciaCab}&id-asistencia-det=${idControlAsistenciaDet}`;
    return this._httpClient.post<any>(url, null);
  }

  registerCierreDetalle(idControlAsistenciaDet: number){
    const url = `${URL_BASE}/asistencia/cerrar-det/${idControlAsistenciaDet}`;
    return this._httpClient.post<any>(url, null);
  }

  registerCierreTaller(idControlAsistenciaCab: number){
    const url = `${URL_BASE}/asistencia/cerrar-cab/${idControlAsistenciaCab}`;
    return this._httpClient.post<any>(url, null);
  }

  registerContinuacionAsistencia(idControlAsistenciaSubDet: number, continua: boolean){
    const url = `${URL_BASE}/asistencia/continuar-taller?id-asistencia-sub-det=${idControlAsistenciaSubDet}&continua=${continua}`;
    return this._httpClient.post<any>(url, null);
  }

  deleteElegidos(model: number[]){
    const url = `${URL_BASE}/asistencia/eliminar-participante`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(model)
    };

    return this._httpClient.delete<any>(url, httpOptions);
  }

  getListaPreInscritos(idProgDet: number){
    const url = `${URL_BASE}/inscripcion/asegurados-por-participar?id-programacion-det=${idProgDet}`;
    return this._httpClient.get<any>(url);
  }

  registerAsistenciaAsistira(model: RequestRegisterAsistio){
    const url = `${URL_BASE}/inscripcion/asistira`;
    return this._httpClient.post<any>(url, model);
  }
  // --------------------------------------------------------------------------------

  getSiEsApto(model: RequestBuscarApto) {
    const url = `${environment.API}/asegurado/buscar/aptos`;
    return this._httpClient.post<any>(url, model);
  }

  getListAsegurados() {
    const payload = {
      idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      texto : '',
      pageNum : 1,
      pageSize : 10
    }
    const url = `${environment.API}/asegurado/buscar/nombres`;
    return this._httpClient.post<any>(url, payload);
  }

  getListAseguradosFindByText(texto: string, pageNum: number, pageSize: number) {
    const payload = {
      idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      texto,
      pageNum,
      pageSize
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
    idUsuarioReg: string,
    conConexion: boolean
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

    const url = `${URL_BASE}/listar/inscripcion`;
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

  actualizarEstadoEliminadoRegistradosHistorico(lista : number[]){
    console.log(lista);
    const url = `${URL_BASE}/asistencia/eliminar-asegurado`;
  
    return this._httpClient.post<any>(url, lista);
  }

  //control/inscripcion/registrar
}
