import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ProgramacionRequestListContratos, ProgramacionRequestRegisterServicio } from '@models/programacion/programacion-contratos/programacion-contrato-lista.model';

const URL_BASE = `${environment.API}/programacion`;

@Injectable({
  providedIn: 'root'
})
export class ProgramacionContratosService {

  constructor(private _httpClient: HttpClient) { }

  listContratosProgramacion(model: ProgramacionRequestListContratos){
    const url = `${URL_BASE}/listar`;
    return this._httpClient.post<any>(url,model);
  }

  getDatosContrato(idProgramacion: string){
    const url = `${URL_BASE}/obtener/datos-contrato/${idProgramacion}`;
    return this._httpClient.post<any>(url,null);
  }

  getDatosServicioContrato(idProgramacion: string){
    const url = `${URL_BASE}/servicios/contratados/${idProgramacion}`;
    return this._httpClient.get<any>(url);
  }

  getServiciosProgramados(idProgramacion: string){
    const url = `${URL_BASE}/detalle/listar/servicios-programados?id-programacion=${idProgramacion}&id-unid-ope=${(JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa}`;
    return this._httpClient.get<any>(url);
  }

  getResumenInferiorProgramacion(idProgramacion: number){
    const url = `${URL_BASE}/obtener/resumen/programados/${idProgramacion}`;
    return this._httpClient.get<any>(url);
  }

  getDataAsignacionServicioSelected(idProgramacionDet: any){
    const url = `${URL_BASE}/detalle/obtener/datos/${idProgramacionDet}`;
    return this._httpClient.get<any>(url);
  }

  getServiciosProgramadosContrato(idProgramacion: number){
    const url = `${URL_BASE}/detalle/listar/${idProgramacion}`;
    return this._httpClient.get<any>(url);
  }

  publicarProgramacion(idProgramacion: number){
    const url = `${URL_BASE}/publicar/${idProgramacion}`;
    return this._httpClient.put<any>(url, null);
  }

  limpiarProgramacion(idProgramacion: number){
    const url = `${URL_BASE}/limpiar/${idProgramacion}`;
    return this._httpClient.post<any>(url,null);
  }

  registerAsignacionesDia(model: ProgramacionRequestRegisterServicio){
    const url = `${URL_BASE}/detalle/registrar`;
    return this._httpClient.post<any>(url,model);
  }

  registerAsignacionAvanzada(model: ProgramacionRequestRegisterServicio[]){
    const url = `${URL_BASE}/detalle/registrar-prog-avanzada`;
    return this._httpClient.post<any>(url,model);
  }

  deleteAsignacionId(idProgramacionDet: number){
    const url = `${URL_BASE}/detalle/eliminar/${idProgramacionDet}`;
    return this._httpClient.delete<any>(url);
  }
}
