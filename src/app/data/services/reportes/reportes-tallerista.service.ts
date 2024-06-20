import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { PayloadReportes, ResponseAsistencia } from '@models/dashboard/dashboard.model';
import { DtGenerico } from '@models/generico/dt-generico';
import { itemReporteAsistenciaTaller, itemReporteTallerista } from '@models/reportes/reportes-tallerista';
import { ReportesTalleristaPayload } from '@models/reportes/reportes-tallerista';
import { data } from './data-test';
import { of, delay, Observable } from 'rxjs';


const URL_BASE = `${environment.API}`;

@Injectable({
  providedIn: 'root'
})
export class ReportesTalleristaService {

  constructor(private _httpClient: HttpClient) { }

  getDataReporteTalleristas(payload: ReportesTalleristaPayload){
    const url = `${environment.API}/tallerista/listar/talleres`; 
    return this._httpClient.post<DtGenerico<itemReporteTallerista>>(url,payload);
  }

  getDataReporteAsistenciaTaller(payload: ReportesTalleristaPayload) : Observable<DtGenerico<itemReporteAsistenciaTaller>>{
    const url = `${environment.API}/tallerista/listar/talleres`; 
    return of(data).pipe(delay(500));
    //return this._httpClient.post<DtGenerico<itemReporteTallerista>>(url,payload);
  }
}
