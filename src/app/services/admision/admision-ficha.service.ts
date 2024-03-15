import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { AcreditarFichaPostulante, dataPersonaResponse } from '@models/admision/datos-persona.model';
import { RequestEditFicha } from '@models/admision/edit-ficha-admision.model';
import { dataRequest, listaFichaAdmisionRequest, listaFichaAdmisionResponse, registerFichaRequest } from '@models/admision/ficha-admision.model';
import { Observable } from 'rxjs';

const URL_BASE = `${environment.API}/ficha-admision`;

@Injectable({ providedIn: 'root' })
export class AdmisionFichaService {

  constructor(private _httpClient: HttpClient) { }

  getFicha(idFicha: string){
    const url = `${URL_BASE}/obtenerPorId/${idFicha}`;
    return this._httpClient.get<any>(url);
  }

  validarAdmisionIngreso(model: AcreditarFichaPostulante){
    const url = `${URL_BASE}/acreditar/registro?tipoDoc=${model.tipoDoc}&numDoc=${model.numDoc}&idUnidadOpe=${model.idUnidadOpe}`;
    return this._httpClient.get<any>(url);
  }

  getNumeroHistoria(idUnidad: string){
    const url = `${URL_BASE}/getNewNumHistoria/${idUnidad}`;
    return this._httpClient.get<any>(url);
  }

  getDatoSeguro(tipo: string, numDoc: string){
    const url = `https://apps.essalud.gob.pe/sagw/sigps/viva-apidatosmaestros/ASEGURADO/Buscar?VS_TIPODOCUME=${tipo}&VS_NRODOCUMEN=${numDoc}`;
    return this._httpClient.get<any>(url);
  }

  getFichasAdmision(model: listaFichaAdmisionRequest){
    const url = `${URL_BASE}/listarPorFiltros`;
    return this._httpClient.post<listaFichaAdmisionResponse>(url, model);
  }
  
  searchAndFindData(model: dataRequest){
    const url = `${environment.API}/client/afiliado/getConsultaDatos`
    return this._httpClient.post<any>(url,model);
  }

  getDataPersonaReniec(dni: string){
    const url = `${environment.API}/client/persona/getConsultaDatosRaus/dni/${dni}`
    return this._httpClient.get<dataPersonaResponse>(url);
  }

  getImgPersona(tipoDoc: any, numDoc: any){
    const url = `${environment.API}/client/afiliado/sagw-qa-identapi-v2/busqueda?tipodoc=${tipoDoc}&numerodocumento=${numDoc}&busqueda=2&codigo=0H2YU123&file=1`
    return this._httpClient.get<any>(url);
  }
  
  registerFichaAdmision(model: registerFichaRequest){
    const url = `${URL_BASE}/registrar`;
    return this._httpClient.post<any>(url,model);
  }

  editFichaAdmision(idFicha: string, model: RequestEditFicha){
    const url = `${URL_BASE}/actualizar/${idFicha}`;
    return this._httpClient.post<any>(url,model);
  }

  getImpresionFichaAdmision(idFicha: string): Observable<Blob>{
    const url = `${URL_BASE}/imprimir/${idFicha}`;
    return this._httpClient.get(url,{responseType:'blob'});
  }
}
