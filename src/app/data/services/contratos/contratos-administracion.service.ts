import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { imprimirRequest, imprimirRequestCam, listaConstactosRequest } from '@models/afiliados/ficha-solicitud.model';
import { RequestContratoDetalle, RequestEditCabecera, RequestListContracts, RequestSearchUser, RequestSendCabeceraContrato } from '@models/contratos/contratos-administracion.model';
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

  getListServiciosByTxt(txt : String){
    const url = `${environment.API}/servicio/buscar/activos?texto=${txt}`;
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

  saveDataDetalleContrato(model: RequestContratoDetalle){
    const url = `${URL_BASE}/registrar/detalle`;
    return this._httpClient.post<any>(url, model);
  }

  editCabeceraContrato(model: RequestEditCabecera){
    const url = `${URL_BASE}/actualizar/cabecera`;
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

  confirmContrato(numOc: string){
    const url = `${URL_BASE}/confirmar/${numOc}`;
    return this._httpClient.post<any>(url, null);
  }

  deleteContrato(id: number){
    const url = `${URL_BASE}/eliminar/${id}`;
    return this._httpClient.delete<any>(url);
  }

  contratoListarRed(model: listaConstactosRequest){
    const url = `${environment.API}/contrato/listar/red`;
    return this._httpClient.post<any>(url, model);
  }

  getExcelContratadosRed(model: imprimirRequestCam): Observable<Blob>{
    const url = `${environment.API}/report/contrato/excel/lista-contratos`;
    return this._httpClient.post(url, model, {responseType:'blob', headers: new HttpHeaders({'Accept': 'application/octet-stream'})});
  }
}
