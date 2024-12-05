import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { listarProgramasRequest, listarSubProgramasRequest, ProgramaListadoItem, SubprogramaListadoItem } from '@models/cartera-de-servicios/cartera-de-servicios';
import { DtGenericoPaginado } from '@models/generico/dt-generico';

const URL_BASE = `${environment.API}/programa`;

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {

  constructor(private _httpClient: HttpClient) { }

  listarProgramas(model : listarProgramasRequest){
    const url = `${URL_BASE}/dt/listar`;
    return this._httpClient.post<DtGenericoPaginado<ProgramaListadoItem[]>>(url, model);
  }
}
