import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { listarSubProgramasRequest, SubProgramaCrearRequestDto, SubProgramaEditarRequestDto, SubprogramaListadoItem } from '@models/cartera-de-servicios/cartera-de-servicios';
import { DtGenericoPaginado, DtGenericoSinPaginar } from '@models/generico/dt-generico';

const URL_BASE = `${environment.API}/subprograma`;

@Injectable({
  providedIn: 'root'
})
export class SubProgramaService {

  constructor(private _httpClient: HttpClient) { }
  

  listarSubProgramas(model : listarSubProgramasRequest){
    const url = `${URL_BASE}/dt/listar`;
    return this._httpClient.post<DtGenericoPaginado<SubprogramaListadoItem[]>>(url, model);
  }

  listarActivos(){
    const url = `${URL_BASE}/activos`;
    return this._httpClient.get<DtGenericoSinPaginar<any>>(url);
  }

  registrarSubprograma(model : SubProgramaCrearRequestDto){
    const url = `${URL_BASE}/crear`;
    return this._httpClient.post<DtGenericoSinPaginar<any>>(url, model);
  }

  editarSubPrograma(idSubPrograma: number, model : SubProgramaEditarRequestDto){
    const url = `${URL_BASE}/editar/${idSubPrograma}`;
    return this._httpClient.put<DtGenericoSinPaginar<any>>(url, model);
  }

}
