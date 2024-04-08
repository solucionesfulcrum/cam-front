import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { RequestListTallerista, RequestListTalleristaContrato } from '@models/contactos/talleristas/contactos-talleristas.model';

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

  getListContratosTallerista(model: RequestListTalleristaContrato){
    const url = `${URL_BASE}/listar/contratos`;
    return this._httpClient.post<any>(url,model);
  }
  
  getTalleristaActivacion(idUsuario: number){
    const url = `${URL_BASE}/activaciones/vigentes?idUsuarioTallerista=${idUsuario}`;
    return this._httpClient.get<any>(url);
  }
}
