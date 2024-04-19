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

  getDatosContrato(numOc: string){
    let model = {
      idUnidOpe: JSON.parse(localStorage.getItem("UnidElegida")!).idUnidOperativa,
      numOc: numOc
    }
    const url = `${URL_BASE}/obtener/datos-contrato`;
    return this._httpClient.post<any>(url,model);
  }

  getDatosServicioContrato(idProgramacion: number){
    const url = `${URL_BASE}/servicios/contratados/${idProgramacion}`;
    return this._httpClient.get<any>(url);
  }
}
