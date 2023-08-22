import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { dataPersonaResponse } from '@models/datos-personas.model';
import { dataRequest, listaFichaSolicitudRequest, listaFichaSolicitudResponse } from '@models/ficha-solicitud.model';
import { TipoParametro } from '@models/parametros-busqueda.model';
import { Observable } from 'rxjs';


const URL_BASE = `${environment.HOST}/ficha-solicitud`;

@Injectable({
  providedIn: 'root'
})
export class AfiliadoService {

  constructor(private _httpClient: HttpClient) { }

  getFicha(idFicha: string){
    const url = `${URL_BASE}/obtenerPorId/${idFicha}`;
    return this._httpClient.get<any>(url);
  }

  getFichasSolicitud(model: listaFichaSolicitudRequest){
    const url = `${URL_BASE}/listarPorFiltros`;
    return this._httpClient.post<listaFichaSolicitudResponse>(url, model);
  }
  
  searchAndFindData(model: dataRequest){
    const url = `${environment.HOST}/client/afiliado/getConsultaDatos`
    return this._httpClient.post<any>(url,model);
  }
  getDataPersonaReniec(dni: string){
    const url = `${environment.HOST}/client/persona/getConsultaDatosRaus/dni/${dni}`
    return this._httpClient.get<dataPersonaResponse>(url);
  }

  getTipoParametros(tipo: string){
    const url = `${environment.HOST}/parametros/listarPorTipo?tipo=${tipo}`;
    return this._httpClient.get<TipoParametro>(url);
  }
}

