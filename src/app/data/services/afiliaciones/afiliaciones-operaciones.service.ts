import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { RequestListEvaluaciones, RequestListOperaciones } from '@models/afiliaciones/operaciones/evaluacion-operacion.model';

const URL_BASE = `${environment.API}/auditoria/operaciones`;

@Injectable({
  providedIn: 'root'
})
export class AfiliacionesOperacionesService {

  constructor(private _httpClient                 : HttpClient) { }

  getListOperaciones(model: RequestListOperaciones){
    const url = `${URL_BASE}/listar`;
    return this._httpClient.post<any>(url, model);
  }

  getListEvaluaciones(model: RequestListEvaluaciones){
    const url = `${environment.API}/evaluacion/listar`;
    return this._httpClient.post<any>(url, model);
  }
}
