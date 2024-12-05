import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { listarSubProgramasRequest, SubprogramaListadoItem } from '@models/cartera-de-servicios/cartera-de-servicios';
import { DtGenericoPaginado } from '@models/generico/dt-generico';

const URL_BASE = `${environment.API}/subprograma`;

@Injectable({
  providedIn: 'root'
})
export class SubprogramaService {

  constructor(private _httpClient: HttpClient) { }

  listarSubProgramas(model : listarSubProgramasRequest){
    const url = `${URL_BASE}/dt/listar`;
    return this._httpClient.post<DtGenericoPaginado<SubprogramaListadoItem[]>>(url, model);
  }

}
