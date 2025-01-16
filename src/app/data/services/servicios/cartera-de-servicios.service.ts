import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { EditarServicioRequestDto, listarProgramasRequest, listarServiciosRequest, listarSubProgramasRequest, ProgramaListadoItem, RegistrarServicioRequestDto, ServicioListadoItem, SubprogramaListadoItem } from '@models/cartera-de-servicios/cartera-de-servicios';
import { DtGenericoPaginado, DtGenericoSinPaginar } from '@models/generico/dt-generico';


const URL_BASE = `${environment.API}/servicio`;

@Injectable({
  providedIn: 'root'
})
export class CarteraDeServiciosService {

  constructor(private _httpClient: HttpClient) { }

  //SERVICIOS
  
  listarServicios(model : listarServiciosRequest){
    const url = `${URL_BASE}/servicios/dt/listar`;
    return this._httpClient.post<DtGenericoPaginado<ServicioListadoItem[]>>(url, model);
  }
  
  registrarServicio(model : RegistrarServicioRequestDto){
    const url = `${URL_BASE}/registrar/servicio`;
    return this._httpClient.post<DtGenericoSinPaginar<any>>(url, model);
  }

  editarServicio(model : EditarServicioRequestDto){
    const url = `${URL_BASE}/editar/servicio`;
    return this._httpClient.post<DtGenericoSinPaginar<any>>(url, model);
  }



}
