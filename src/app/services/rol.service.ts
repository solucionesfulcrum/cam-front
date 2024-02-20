import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

const URL_BASE = `${environment.API}/roles`;

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private _httpClient: HttpClient) { }

  getListRoles(){
    const url = `${URL_BASE}/listar`;
    return this._httpClient.get<any>(url);
  }

  getListRolesActivos(){
    const url = `${URL_BASE}/listar/activos`;
    return this._httpClient.get<any>(url);
  }
}
