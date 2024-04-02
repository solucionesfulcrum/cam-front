import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { RequestListContracts, RequestSearchUser, RequestSendCabeceraContrato } from '@models/contratos/contratos-administracion.model';
import { Observable } from 'rxjs';

const URL_BASE = `${environment.API}/contrato`;

@Injectable({
  providedIn: 'root'
})
export class ContratosAdministracionService {

  constructor(private _httpClient                 : HttpClient) { }

  getListCamById(){
    const url = `${environment.API}/unidad-operativa/listar/cam-ciram?idUnidadOperativa=${(JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa}`;
    return this._httpClient.get<any>(url);
  }

  getListServicios(){
    const url = `${environment.API}/servicio/buscar/activos?texto=`;
    return this._httpClient.get<any>(url);
  }

  getListContratos(model: RequestListContracts){
    const url = `${URL_BASE}/listar`;
    return this._httpClient.post<any>(url, model);
  }

  searchForPerson(model: RequestSearchUser){
    const url = `${URL_BASE}/buscar/usuario`;
    return this._httpClient.post<any>(url, model);
  }

  getDataFromOC(oc: string){
    const url = `${URL_BASE}/obtener/datos/${oc}`;
    return this._httpClient.get<any>(url);
  }

  saveDataContrato(model: RequestSendCabeceraContrato){
    const url = `${URL_BASE}/registro/inicial`;
    return this._httpClient.post<any>(url, model);
  }

  saveFileOc(fd: FormData){
    const url = `${URL_BASE}/load/file-oc`;
    return this._httpClient.post<any>(url, fd);
  }

  getFileOc(numOc: string): Observable<Blob>{
    const url = `${URL_BASE}/download/file-oc?numOc=${numOc}`;
    return this._httpClient.get(url,{responseType:'blob'});
  }
}
