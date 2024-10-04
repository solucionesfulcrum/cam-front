import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';


const URL_BASE = `${environment.API}/asegurado`;

@Injectable({
  providedIn: 'root'
})
export class ControlAptosService {

  constructor(private _httpClient: HttpClient) { }

  
  buscarApto(idUnidadOpe: number,tipoDoc: string, numdoc: string, fechaNacimiento?: String | null){
    if(fechaNacimiento){
      let splitFecNac = fechaNacimiento.split("-");
      fechaNacimiento = splitFecNac[2]+"/"+splitFecNac[1]+"/"+splitFecNac[0]
    }

    const url = `${URL_BASE}/buscar/aptos`;
    return this._httpClient.post<any>(url, { 
    "idUnidadOperativa":idUnidadOpe,
    "tipDoc":tipoDoc,
    "numDoc":numdoc,
    "fechaNacimiento": fechaNacimiento
  });
  }


}
