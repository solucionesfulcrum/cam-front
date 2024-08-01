import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { imprimirRequest, imprimirRequestCam } from '@models/afiliados/ficha-solicitud.model';
import { RequestListTallerista, RequestListTalleristaContrato } from '@models/contactos/talleristas/contactos-talleristas.model';
import { Observable } from 'rxjs';

const URL_BASE = `${environment.API}/tallerista`;

@Injectable({
  providedIn: 'root'
})
export class ContactosTalleristasService {

  constructor(private _httpClient: HttpClient) { }

  getTalleristaList(model: RequestListTallerista){
    const url = `${URL_BASE}/listar`;
    return this._httpClient.post<any>(url,model);
  }

  getDataTallerista(idUsuario: string){
    const url = `${URL_BASE}/obtener/datos/usuario/${idUsuario}`;
    return this._httpClient.get<any>(url);
  }

  getListContratosTallerista(model: RequestListTalleristaContrato){
    const url = `${URL_BASE}/listar/contratos`;
    return this._httpClient.post<any>(url,model);
  }
  
  getTalleristaActivacion(idUsuario: number){
    const url = `${URL_BASE}/activaciones/vigentes?idUsuario=${idUsuario}`;
    return this._httpClient.get<any>(url);
  }

  getTalleristaListRed(model: RequestListTallerista){
    const url = `${URL_BASE}/listar/red`;
    return this._httpClient.post<any>(url,model);
  }

  getExcelTalleristas(model: imprimirRequestCam): Observable<Blob>{
    const url = `${environment.API}/report/tallerista/excel/lista-tallerista`; 
    return this._httpClient.post(url, model, {responseType:'blob', headers: new HttpHeaders({'Accept': 'application/octet-stream'})});
  }

  
  getExcelTalleristasCam(model: imprimirRequest): Observable<Blob>{
  const url = `${environment.API}/report/tallerista/excel/lista-tallerista-cam`; 
  return this._httpClient.post(url, model, {responseType:'blob', headers: new HttpHeaders({'Accept': 'application/octet-stream'})});
  }
}
