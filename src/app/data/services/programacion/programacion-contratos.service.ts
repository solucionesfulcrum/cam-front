import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ProgramacionRequestListContratos } from '@models/programacion/programacion-contratos/programacion-contrato-lista.model';

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

  getDatosServicioContrato(idProgramacion: number){
    const url = `${URL_BASE}/servicios/contratados/${idProgramacion}`;
    return this._httpClient.get<any>(url);
  }

  getResumenInferiorProgramacion(idProgramacion: number){
    const url = `${URL_BASE}/obtener/resumen/programados/${idProgramacion}`;
    return this._httpClient.get<any>(url);
  }
}
