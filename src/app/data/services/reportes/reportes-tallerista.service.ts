import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { PayloadReportes, ResponseAsistencia } from '@models/dashboard/dashboard.model';
import { DtGenericoPaginado, DtGenericoSinPaginar, ResponseGenerico } from '@models/generico/dt-generico';
import { AsistenciaTaller, CabeceraAsistenciaReporte, ItemReporteAsistenciaTaller, ItemReporteTallerista, imprimirRequestTalleresTallerista } from '@models/reportes/reportes-tallerista';
import { ReportesTalleristaPayload } from '@models/reportes/reportes-tallerista';
import { of, delay, Observable } from 'rxjs';


const URL_BASE = `${environment.API}`;

@Injectable({
  providedIn: 'root'
})
export class ReportesTalleristaService {

  constructor(private _httpClient: HttpClient) { }

  getDataReporteTalleristas(payload: ReportesTalleristaPayload){
    const url = `${environment.API}/tallerista/listar/talleres`; 
    return this._httpClient.post<DtGenericoPaginado<ItemReporteTallerista[]>>(url,payload);
  }

  getDataCabeceraAsistenciaTaller(idProgDet: string){
    const url = `${environment.API}/control/obtener/cabecera/asistencia/reporte/${idProgDet}`; 
    return this._httpClient.get<ResponseGenerico<CabeceraAsistenciaReporte>>(url);
  }

  getDataReporteAsistenciaTaller(idAsistenciaDet: number) {
    const url = `${environment.API}/control/asistencia/listar/participantes?id-asistencia-det=${idAsistenciaDet}`; 
    return this._httpClient.get<DtGenericoSinPaginar<AsistenciaTaller[]>>(url);
  }

  getDataReporteAsistenciaTallerEliminados(idAsistenciaDet: number) {
    const url = `${environment.API}/control/asistencia/listar/participantes-eliminados?id-asistencia-det=${idAsistenciaDet}`; 
    return this._httpClient.get<DtGenericoSinPaginar<AsistenciaTaller[]>>(url);
  }

  getExcelTalleresTallerista(model: imprimirRequestTalleresTallerista): Observable<Blob>{
    const url = `${environment.API}/report/tallerista/excel/lista/talleres`;
    return this._httpClient.post(url, model, {responseType:'blob', headers: new HttpHeaders({'Accept': 'application/octet-stream'})});
  }

  
}
