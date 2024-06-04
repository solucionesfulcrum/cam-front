import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { RequestChangePassword, RequestCiramRegistro, RequestDatosFormacionRegistro, RequestDatosPersonalesRegistro, changePassword } from '@models/dashboard/dashboard.model';
import { TipoParametro } from '@models/parametros-busqueda.model';

const URL_BASE = `${environment.API}`;

@Injectable({ providedIn: 'root' })
export class DatosGeneralesService {

  unidOperativElegida: number = 0;

  constructor(private _httpClient: HttpClient) { }

  private _authBasic() {
    const params = new HttpParams().set(
      'g',
      '4440d2e2-1eae-4617-a0c2-0e3824a5e875'
    );
    return params;
  }


  getTipoParametros(tipo: string) {
    const url = `${environment.API}/parametros/listarPorTipo?tipo=${tipo}`;
    return this._httpClient.get<TipoParametro>(url);
  }

  getCams(codigo: string) {
    const url = `${environment.API}/unidad-operativa/listar/cam/red?id-uo-red=${codigo}`;
    return this._httpClient.get<TipoParametro>(url);
  }

  getCamsCiram(codigo: string, texto: string) {
    const url = `${environment.API}/unidad-operativa/listar/ciram?texto=${codigo}&codigo-cam=${texto}`;
    return this._httpClient.get<TipoParametro>(url);
  }


  getReds() {
    const url = `${environment.API}/unidad-operativa/listar/red`;
    return this._httpClient.get<TipoParametro>(url);
  }
  
  

  getDepartamentosReniec() {
    const url = `${URL_BASE}/client/essi/ubigeo/departamento-reniec/listar`;
    return this._httpClient.get<any>(url);
  }

  getProvinciasReniec(codDepart: string) {
    const url = `${URL_BASE}/client/essi/ubigeo/provincia-reniec/listar/${codDepart}`;
    return this._httpClient.get<any>(url);
  }

  getDistritosReniec(codProv: string) {
    const url = `${URL_BASE}/client/essi/ubigeo/distrito-reniec/listar/${codProv}`;
    return this._httpClient.get<any>(url);
  }

  getRedesAsistenciales() {
    const url = `${URL_BASE}/client/essi/centroasistencial/lista`;
    return this._httpClient.get<any>(url);
  }

  searchRegion(inst: string, text: string) {
    const url = `${URL_BASE}/ubigeo/buscar/region?institucion=${inst}&texto=${text}`;
    return this._httpClient.get<any>(url);
  }

  searchByUbigeo(ubigeo: string) {
    const url = `${URL_BASE}/client/essi/ubigeo/${ubigeo}`;
    return this._httpClient.get<any>(url);
  }

  searchDependencias(inst: string, text: string, codReg: string) {
    const url = `${URL_BASE}/dependencia/buscar/ipress?texto=${text}&institucion=${inst}&codRegion=${codReg}`;
    return this._httpClient.get<any>(url);
  }

  searchUnidadOperativa(tipo: string, text: string) {
    const url = `${URL_BASE}/unidad-operativa/listarPorTipo/${tipo}?texto=${text}`;
    return this._httpClient.get<any>(url);
  }

  getUnidadesOperativas(texto: string) {
    const url = `${URL_BASE}/unidad-operativa/listar/cam?texto=${texto}`;
    return this._httpClient.get<any>(url);
  }

  getUnidadesOperativasRed(texto: string, red: string) {
    const url = `${URL_BASE}/unidad-operativa/listar/cam?texto=${texto}&codigo-red=${red}`;
    return this._httpClient.get<any>(url);
  }

  getUnidadesOperativasRol(texto: string, idRol: number) {
    const url = `${URL_BASE}/roles/listar/unidadesOperativas?texto=${texto}` + `&idRol=${idRol}`;
    return this._httpClient.get<any>(url);
  }
  //roles/listar/unidadesOperativas?texto=&idRol=9


  getUnidadesOperativasAsignadas(idUsuario: number) {
    const url = `${URL_BASE}/unidad-operativa/activas/usuario/${idUsuario}`;
    return this._httpClient.get<any>(url);
  }

  getTiposProcesos() {
    const url = `${URL_BASE}/proceso/listar/activos`;
    return this._httpClient.get<any>(url);
  }

  getListaMeses() {
    const url = `${URL_BASE}/mes/listar`;
    return this._httpClient.get<any>(url);
  }

  getListaActividades() {
    const url = `${URL_BASE}/actividad/listar/activos`;
    return this._httpClient.get<any>(url);
  }

  validarAdmisionIngreso(tipoDoc: string, numDoc: string, idUnidadOpe: string, tipoConsulta: number) {
    const url = `${URL_BASE}/ficha-admision/acreditar/registro?tipoDoc=${tipoDoc}&numDoc=${numDoc}&idUnidadOpe=${idUnidadOpe}&tipoConsulta=${tipoConsulta}`;
    return this._httpClient.get<any>(url);
  }

  getRedesEssi() {
    const url = `${URL_BASE}/client/essi/redes/lista`;
    return this._httpClient.get<any>(url);
  }

  getIpressEssi(codRed: string) {
    const url = `${URL_BASE}/client/essi/lista-ipress/${codRed}`;
    return this._httpClient.get<any>(url);
  }

  getListCiramsOfCam(idUnidadOpe: number) {
    const url = `${URL_BASE}/unidad-operativa/listar/ciramUo?idUndiadOperativa=${idUnidadOpe}`;
    return this._httpClient.get<any>(url);
  }

  getObtenerDatos(idUser: number) {
    const url = `${URL_BASE}/usuario/perfil/obtener/datos/${idUser}`;
    return this._httpClient.get<any>(url);
  }

  registerCiram(model: RequestCiramRegistro) {
    const url = `${URL_BASE}/unidad-operativa/registrar/ciram`;
    return this._httpClient.post<any>(url, model);
  }

  getObtenerNacionalidad(texto: string) {
    const url = `${URL_BASE}/client/essi/nacionalidad/${texto}`;
    return this._httpClient.get<any>(url);
  }

  registerDatosPersonales(model: RequestDatosPersonalesRegistro) {
    const url = `${URL_BASE}/usuario/perfil/datos-personales/registrar`;
    return this._httpClient.post<any>(url, model);
  }

  registerDatosFormacion(model: RequestDatosFormacionRegistro) {
    const url = `${URL_BASE}/usuario/perfil/datos-formacion-prof/registrar`;
    return this._httpClient.post<any>(url, model);
  }

  loginChangePassword(model: RequestChangePassword) {
    const url = `${URL_BASE}/auth/login`;
    const params = this._authBasic();
    return this._httpClient.post<any>(url, model, { params });
  }

  changePassword(model: changePassword, auth: string) {
    const url = `${URL_BASE}/auth/usuario/change-password`;
    const headers = new HttpHeaders({
      'Authorization': auth 
    });
    return this._httpClient.post<any>(url, model, { headers });
  }

  getProfesion() {
    const url = `${URL_BASE}/profesion/listar/activos`;
    return this._httpClient.get<any>(url);
  }

  saveFileImagenFoto(fd: FormData, idUser: number){
    const url = `${URL_BASE}/usuario/perfil/upload/img-foto/${idUser}`;
    return this._httpClient.post<any>(url, fd);
  }
  saveFileImagenFirma(fd: FormData, idUser: number){
    const url = `${URL_BASE}/usuario/perfil/upload/img-firma/${idUser}`;
    return this._httpClient.post<any>(url, fd);
  }

  getlistaProgramacion(idUnidadOpe: number,fechInicio: string, fechFin: string, texto: string) {
    const url = `${URL_BASE}/programacion/obtener/lista/programacion/?idUnidadOperativa=${idUnidadOpe}&fechInicio=${fechInicio}&fechFin=${fechFin}&texto=${texto}`;
    return this._httpClient.get<any>(url);
  }
}