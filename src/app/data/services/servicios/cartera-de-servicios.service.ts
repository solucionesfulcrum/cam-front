import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { listarServiciosRequest, ServicioListadoItem } from '@models/cartera-de-servicios/cartera-de-servicios';
import { DtGenericoPaginado } from '@models/generico/dt-generico';


const URL_BASE = `${environment.API}/servicio`;

@Injectable({
  providedIn: 'root'
})
export class CarteraDeServiciosService {

  constructor(private _httpClient: HttpClient) { }
  
  listarServicios(model : listarServiciosRequest){
    const url = `${URL_BASE}/servicios/dt/listar`;
    return this._httpClient.post<DtGenericoPaginado<ServicioListadoItem[]>>(url, model);
  }
}
