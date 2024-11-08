import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { DtGenericoPaginado, ResponseGenerico } from '@models/generico/dt-generico';
import { ReportesGeneradosRequest, ReporteUsuario, ReporteUsuarioEditarRequest, ReporteUsuarioRegistrarRequest } from '@models/reporte-usuario/reporte-usuario';

const URL_BASE = `${environment.API}/reporte-usuario`;

@Injectable({
  providedIn: 'root'
})
export class ReporteUsuarioService {

  constructor(private _httpClient: HttpClient) { }

  registrarReporteUsuario(model: ReporteUsuarioRegistrarRequest) {
    const url = `${URL_BASE}/registrar`;
    return this._httpClient.post<ResponseGenerico<any>>(url, model);
  }

  editarReporteUsuario(idReporteUsuario: number, model: ReporteUsuarioEditarRequest) {
    const url = `${URL_BASE}/editar/${idReporteUsuario}`;
    return this._httpClient.put<ResponseGenerico<any>>(url, model);
  }

  obtenerReporteUsuarioPorId(idReporteUsuario: number){
    const url = `${URL_BASE}/${idReporteUsuario}`;
    return this._httpClient.get<ResponseGenerico<ReporteUsuario>>(url);
  }

  listarReportesUsuario(idUsuario: number){
    const url = `${URL_BASE}/listar/${idUsuario}`;
    return this._httpClient.get<ResponseGenerico<ReporteUsuario[]>>(url);
  }

  listarReportesUsuarioDt(model: ReportesGeneradosRequest){
    const url = `${URL_BASE}/listar-reportes-generados`;
    return this._httpClient.post<DtGenericoPaginado<ReporteUsuario[]>>(url, model);
  }

  eliminarReporteUsuario(idReporteUsuario: number){
    const url = `${URL_BASE}/eliminar/${idReporteUsuario}`;
    return this._httpClient.delete<ResponseGenerico<any>>(url);
  }

  descargarReporte(idReporteUsuario: number) {
    const url = `${URL_BASE}/descargar-reporte/${idReporteUsuario}`;
    return this._httpClient.get<any>(url, { responseType: 'blob' as 'json' });
  }
}
