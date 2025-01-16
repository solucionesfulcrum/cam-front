import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { RequestAsignarProcesos, RequestBandejaProfesional } from '@models/contacto/profesional.model';

const URL_BASE = `${environment.API}/profesional`;

@Injectable({
  providedIn: 'root'
})
export class ContactoProfesionalesService {
  idUnidadOperativaUser = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;
  asignacionProcesosCompartida: RequestAsignarProcesos = Object();


  constructor(private _httpClient: HttpClient) { }

  getBandejaProfesionales(model: RequestBandejaProfesional){
    const url = `${URL_BASE}/listar/bandeja`;
    return this._httpClient.post<any>(url, model);
  }

  getInfoPersonal(idProfesional: string){
    const url = `${URL_BASE}/${idProfesional}/${this.idUnidadOperativaUser}`;
    return this._httpClient.get<any>(url);
  }

  getListProcesos(){
    const url = `${environment.API}/proceso/listar/activos`;
    return this._httpClient.get<any>(url);
  }

  setChangesToPro(){
    let model = this.asignacionProcesosCompartida;
    this.asignacionProcesosCompartida = Object();

    const url = `${URL_BASE}/registrar`;
    return this._httpClient.post<any>(url,model);
  }

  getListProfUnidadRehab(procesoId: any, unidOperId: any){
    const url = `${environment.API}/profesional/listar/por-unidad?procesoId=${procesoId}&unidOperativaId=${unidOperId}`;
    return this._httpClient.get<any>(url);
  }
}
