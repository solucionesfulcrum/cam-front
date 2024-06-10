import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { AsistenciasTalleres, PayloadReportes, ResponseAsistencia } from '@models/dashboard/dashboard.model';
import { Http } from '@models/generico/http';
import { Observable, delay, of } from 'rxjs';

const URL_BASE = `${environment.API}/asegurado`;

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private _httpClient: HttpClient) { }


  getDataAsistenciaTalleres(payload: PayloadReportes){
    const url = `${URL_BASE}/dashboard/asistencia-cam`; 
    return this._httpClient.post<ResponseAsistencia>(url,payload);
  }
}
