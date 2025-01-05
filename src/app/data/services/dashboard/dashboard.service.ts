import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { RequestDashboardAsistenciaExportarTxt } from '@models/dashboard/dashboard.-talleresmodel';
import { lastValueFrom, Observable } from 'rxjs';

const URL_BASE = `${environment.API}/`;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _httpClient: HttpClient) { }

  obtenerReporteTextPlanoAsistenciaRapida(model: RequestDashboardAsistenciaExportarTxt): Observable<string>{
    const url = `${URL_BASE}/report/control/generar-reporte/text-plano/consulta-asistencia-rapida`;
    return this._httpClient.post(url, model, { responseType: 'text' });
  }

  async obtenerReporteTextPlanoAsistenciaNacional(model: RequestDashboardAsistenciaExportarTxt){
    const url = `${URL_BASE}/report/control/generar-reporte/text-plano/asistencia-rapida-nacional`;
    return await lastValueFrom(this._httpClient.post<any>(url, model));
  }

  async obtenerDatosGraficoAsistenciaRapida(model: RequestDashboardAsistenciaExportarTxt){
    const url = `${URL_BASE}/control/listar/dashboard/asistencia-rapida`;
    return await lastValueFrom(this._httpClient.post<any>(url, model));
  }

}
