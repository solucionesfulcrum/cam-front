import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestAdminAseguradosCam } from '@models/adm-uo/adm-uo';
import { RegisterNota, RegisterSolicitud } from '@models/afiliaciones/register-afiliacion.model';
import { ResponseAsignarCiram, ResponseQuitarCiram } from '@models/afiliados/edit-ficha-solicitud';
import { RequestListaSAfiliadosContacto, RequestListaSolicitudesAfiliados,imprimirRequest,imprimirRequestCam,listaConstactosRequest } from '@models/afiliados/ficha-solicitud.model';
import { DtGenericoSinPaginar } from '@models/generico/dt-generico';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const URL_BASE = `${environment.API}/afiliado`;
const api_URL = environment.API

@Injectable({
  providedIn: 'root'
})
export class AfiliacionesSolicitudesService {

  constructor(private _httpClient: HttpClient) { }

  getListaSolicitudes(model: RequestListaSolicitudesAfiliados){
    const url = `${environment.API}/solicitud/listar`;
    return this._httpClient.post<any>(url, model);
  }

  registerSolicitudAsegurado(model: RegisterSolicitud){
    const url = `${environment.API}/solicitud/registrar`;
    return this._httpClient.post<any>(url, model);
  }

  getDataSolicitud(idSolicitud: string){
    const url = `${environment.API}/solicitud/${idSolicitud}`;
    return this._httpClient.get<any>(url);
  }

  registerNotaSolicitud(model: RegisterNota){
    const url = `${environment.API}/notas/registrar`;
    return this._httpClient.post<any>(url, model);
  }

  listarNotaSolicitud(idSolicitud: string){
    const url = `${environment.API}/notas/listar/${idSolicitud}`;
    return this._httpClient.get<any>(url);
  }

  listarMotivoBaja(){
    const url = `${environment.API}/ficha-admision/baja`;
    return this._httpClient.get<any>(url);
  }

  getListaAfiliados(model: RequestListaSAfiliadosContacto){
    const url = `${URL_BASE}/lista-afiliados`;
    return this._httpClient.post<any>(url, model);
  }

  getListaContacto(model: listaConstactosRequest){
    const url = `${api_URL}/ficha-admision/listar`;
    return this._httpClient.post<any>(url, model);
  }

  getListaContactoRed(model: listaConstactosRequest){
    const url = `${api_URL}/ficha-admision/listar/red`;
    return this._httpClient.post<any>(url, model);
  }

  getListaContactoAdmin(model: RequestAdminAseguradosCam){
    const url = `${api_URL}/ficha-admision/listar/nacional`;
    return this._httpClient.post<any>(url, model);
  }


  getExcelAsegurados(model: imprimirRequest): Observable<Blob>{
    const url = `${api_URL}/report/contactos/excel/lista-asegurados`;
    return this._httpClient.post(url, model, {responseType:'blob', headers: new HttpHeaders({'Accept': 'application/octet-stream'})});
  }

  getExcelAseguradosRed(model: imprimirRequestCam): Observable<Blob>{
    const url = `${api_URL}/report/contactos/excel/lista-asegurados-red`;
    return this._httpClient.post(url, model, {responseType:'blob', headers: new HttpHeaders({'Accept': 'application/octet-stream'})});
  }

  getExcelAseguradosAdmin(model: RequestAdminAseguradosCam): Observable<Blob>{
    const url = `${api_URL}/report/contactos/excel/lista-asegurados-nacional`;
    return this._httpClient.post(url, model, {responseType:'blob', headers: new HttpHeaders({'Accept': 'application/octet-stream'})});
  }

  // getDataSolicitud(tipoDoc: string, numDoc: string){
  //   const url = `${URL_BASE}/ficha-solicitud?tipDoc=${tipoDoc}&numDoc=${numDoc}`;
  //   return this._httpClient.get<any>(url);
  // }

  getDataAfiliado(tipoDoc: string, numDoc: string){
    const url = `${URL_BASE}/ficha-afiliado?tipDoc=${tipoDoc}&numDoc=${numDoc}`;
    return this._httpClient.get<any>(url);
  }

  asignarACiram(idUnidadOperativa: number, idFichasAdmision: number[]){
    const url = `${api_URL}/ficha-admision/asignar-a-ciram`;
    return this._httpClient.post<DtGenericoSinPaginar<ResponseAsignarCiram>>(url,{idUnidadOperativa, idFichasAdmision});
  }

  quitarDeCiram(idFichasAdmision: number[]){
    const url = `${api_URL}/ficha-admision/quitar-ciram`;
    return this._httpClient.post<DtGenericoSinPaginar<ResponseQuitarCiram>>(url,{idFichasAdmision});
  }
}
