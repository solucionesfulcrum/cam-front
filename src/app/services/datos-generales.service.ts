import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { TipoParametro } from '@models/parametros-busqueda.model';

const URL_BASE = `${environment.API}`;

@Injectable({ providedIn: 'root' })
export class DatosGeneralesService {

  unidOperativElegida: number = 0;

  constructor(private _httpClient: HttpClient) { }

  getTipoParametros(tipo: string){
    const url = `${environment.API}/parametros/listarPorTipo?tipo=${tipo}`;
    return this._httpClient.get<TipoParametro>(url);
  }

  getDepartamentosReniec(){
    const url = `${URL_BASE}/ubigeo/departamento-reniec/listar`;
    return this._httpClient.get<any>(url);
  }

  getProvinciasReniec(codDepart: string){
    const url = `${URL_BASE}/ubigeo/provincia-reniec/listar/${codDepart}`;
    return this._httpClient.get<any>(url);
  }

  getDistritosReniec(codProv: string){
    const url = `${URL_BASE}/ubigeo/distrito-reniec/listar/${codProv}`;
    return this._httpClient.get<any>(url);
  }

  getRedesAsistenciales(){
    const url = `${environment.API_ESSI}/centroasistencial/lista`;
    return this._httpClient.get<any>(url);
  }

  searchRegion(inst: string, text: string){
    const url = `${URL_BASE}/ubigeo/buscar/region?institucion=${inst}&texto=${text}`;
    return this._httpClient.get<any>(url);
  }

  searchByUbigeo(ubigeo: string){
    const url = `${URL_BASE}/ubigeo/sas/${ubigeo}`;
    return this._httpClient.get<any>(url);
  }

  searchDependencias(inst: string, text: string, codReg: string){
    const url = `${URL_BASE}/dependencia/buscar/ipress?texto=${text}&institucion=${inst}&codRegion=${codReg}`;
    return this._httpClient.get<any>(url);
  }

  searchUnidadOperativa(tipo: string, text: string){
    const url = `${URL_BASE}/unidad-operativa/listarPorTipo/${tipo}?texto=${text}`;
    return this._httpClient.get<any>(url);
  }

  getUnidadesOperativas(texto : string){
    const url = `${URL_BASE}/unidad-operativa/listar/CAM?texto=${texto}`;
    return this._httpClient.get<any>(url);
  }

  getUnidadesOperativasAsignadas(idUsuario: number){
    const url = `${URL_BASE}/unidad-operativa/activas/usuario/${idUsuario}`;
    return this._httpClient.get<any>(url);
  }

  getTiposProcesos(){
    const url = `${URL_BASE}/proceso/listar/activos`;
    return this._httpClient.get<any>(url);
  }

  getListaMeses(){
    const url = `${URL_BASE}/mes/listar`;
    return this._httpClient.get<any>(url);
  }

  getListaActividades(){
    const url = `${URL_BASE}/actividad/listar/activos`;
    return this._httpClient.get<any>(url);
  }
}
