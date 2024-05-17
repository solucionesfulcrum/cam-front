import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';


const URL_BASE = `${environment.API}/asegurado`;

@Injectable({
  providedIn: 'root'
})
export class ControlAptosService {

  constructor(private _httpClient: HttpClient) { }

  
  buscarApto(idUnidadOpe: number,tipoDoc: number, numdoc: string){
    const url = `${URL_BASE}/buscar/aptos`;
    return this._httpClient.post<any>(url, { 
    "idUnidadOperativa":idUnidadOpe,
    "tipDoc":tipoDoc,
    "numDoc":numdoc});
  }


}
