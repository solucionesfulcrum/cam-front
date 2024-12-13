import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { listarProgramasRequest, listarSubProgramasRequest, ProgramaCrearRequestDto, ProgramaEditarRequestDto, ProgramaListadoItem, SubprogramaListadoItem } from '@models/cartera-de-servicios/cartera-de-servicios';
import { DtGenericoPaginado, DtGenericoSinPaginar } from '@models/generico/dt-generico';
import { ProgramacionRequestRegisterServicio } from '@models/programacion/programacion-contratos/programacion-contrato-lista.model';
import { Observable } from 'rxjs';

const URL_BASE = `${environment.API}/programa`;

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {

  constructor(private _httpClient: HttpClient) { }

  listarProgramas(model : listarProgramasRequest): Observable<DtGenericoPaginado<ProgramaListadoItem[]>>{
    const url = `${URL_BASE}/dt/listar`;
    return this._httpClient.post<DtGenericoPaginado<ProgramaListadoItem[]>>(url, model);
  }

  listarActivos() : Observable<DtGenericoSinPaginar<any>>{
    const url = `${URL_BASE}/activos`;
    return this._httpClient.get<DtGenericoSinPaginar<any>>(url);
  }


  registrarPrograma(model : ProgramaCrearRequestDto): Observable<DtGenericoSinPaginar<any>>{
    const url = `${URL_BASE}/crear`;
    return this._httpClient.post<DtGenericoSinPaginar<any>>(url, model);
  }

  editarPrograma(idPrograma: number, model : ProgramaEditarRequestDto) : Observable<DtGenericoSinPaginar<any>>{
    const url = `${URL_BASE}/editar/${idPrograma}`;
    return this._httpClient.put<DtGenericoSinPaginar<any>>(url, model);
  }
}
