import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ItemListaAsistenciaRapida, ItemListaAsistenciaRapidaNacional } from '@models/control/asistencia-rapida/asistencia-rapida';
import { RequestBuscarApto, RequestBuscarAptoNacional } from '@models/control/asistencia/crud-asistencia.model';
import { RequestAdminAsistenciasRap, RequestCambioHorario, RequestRegisterAsegurado, RequestRegisterAsistio, RequestRegisterCabecera, RequestRegisterDet } from '@models/control/asistencia/service-asistencia.model';
import { DtGenericoPaginado } from '@models/generico/dt-generico';
import { AsistenciaRapidaListaPayload } from '@models/reportes/reportes-tallerista';
import { Observable } from 'rxjs';

const URL_BASE = `${environment.API}/control`;

@Injectable({
  providedIn: 'root'
})
export class ControlProgramacionService {

  constructor(private _httpClient: HttpClient) { }

  getlistaProgramacion(idUnidadOpe: number,fechInicio: string, fechFin: string, texto: string) {
    const url = `${environment.API}/programacion/obtener/lista/usuario/?idUnidadOperativa=${idUnidadOpe}&fechInicio=${fechInicio}&fechFin=${fechFin}&texto=${texto}&idUsuario=${(JSON.parse(localStorage.getItem('camUser')!)).idUsuario}`;
    return this._httpClient.get<any>(url);
  }

  getlistaProgramacionCam(idUnidadOpe: number,fechInicio: string, fechFin: string, texto: string) {
    const url = `${environment.API}/programacion/obtener/lista-cam/usuario/?idUnidadOperativa=${idUnidadOpe}&fechInicio=${fechInicio}&fechFin=${fechFin}&texto=${texto}&idUsuario=${(JSON.parse(localStorage.getItem('camUser')!)).idUsuario}`;
    return this._httpClient.get<any>(url);
  }

  getlistaProgramacionCiram(idUnidadOpe: number,fechInicio: string, fechFin: string, texto: string) {
    const url = `${environment.API}/programacion/obtener/lista-ciram/usuario/?idUnidadOperativa=${idUnidadOpe}&fechInicio=${fechInicio}&fechFin=${fechFin}&texto=${texto}&idUsuario=${(JSON.parse(localStorage.getItem('camUser')!)).idUsuario}`;
    return this._httpClient.get<any>(url);
  }

  getlistaProgramacionCalendario(idUnidadOpe: number,fechInicio: string, fechFin: string, texto: string) {
    const url = `${environment.API}/programacion/obtener/lista/programacion/?idUnidadOperativa=${idUnidadOpe}&fechInicio=${fechInicio}&fechFin=${fechFin}&texto=${texto}`;
    return this._httpClient.get<any>(url);
  }
  
  getCabeceraProgramacion(idProgDet: number) {
    const url = `${URL_BASE}/obtener/cabecera/inscripcion/${idProgDet}`;
    return this._httpClient.get<any>(url);
  }

  getCabeceraClaseRapida(idProgDet: number) {
    const url = `${URL_BASE}/asistencia-rapida/obtener-cabecera-clase/${idProgDet}`;
    return this._httpClient.get<any>(url);
  }

  getSesionClaseRapida(model: {idAsisRapid: number, idUser: number, nroSesion: number, usuarios: number[]}) {
    const url = `${URL_BASE}/asistencia-rapida/obtener-sesion-clase`;
    return this._httpClient.post<any>(url, model);
  }

  finalizarClase(idAsisRapido: number){
    const url = `${URL_BASE}/finalizar-clase/asistencia-rapida/${idAsisRapido}`;
    return this._httpClient.put<any>(url, {});
  }

  finalizarSesion(idAsisSesion: number){
    const url = `${URL_BASE}/asistencia-rapida/finalizar-sesion/${idAsisSesion}`;
    return this._httpClient.get<any>(url, {});
  }
  /*
    getListaContactoAdmin(model: RequestAdminAseguradosCam){
    const url = `${api_URL}/ficha-admision/listar/nacional`;
    return this._httpClient.post<any>(url, model);
  }

  */
  


  // Servicios Asistencia -----------------------------------------------------------
  
  registerDataAsistenciaCabecera(model: RequestRegisterCabecera) {
    const url = `${URL_BASE}/asistencia/cab/registrar`;
    return this._httpClient.post<any>(url, model);
  }

  registerAseguradoDetalle(model: RequestRegisterAsegurado){
    const url = `${URL_BASE}/asistencia/sub-det/registrar`;
    return this._httpClient.post<any>(url, model);
  }

  getCabeceraAsistencia(idProgDet: number) {
    const url = `${URL_BASE}/obtener/cabecera/asistencia/${idProgDet}`;
    return this._httpClient.get<any>(url);
  }
  
  getListAsistencia(idProgDet: number) {
    const url = `${URL_BASE}/asistencia/listar/participantes?id-asistencia-det=${idProgDet}`;
    return this._httpClient.get<any>(url);
  }
  
  registerAsistenciaDet(model: RequestRegisterDet) {
    const url = `${URL_BASE}/asistencia/det/registrar`;
    return this._httpClient.post<any>(url, model);
  }

  registerCambioHorario(model: RequestCambioHorario){
    const url = `${URL_BASE}/asistencia/cambio-de-hora`;
    return this._httpClient.post<any>(url, model);
  }

  registerFijarCursor(idControlAsistenciaCab: number, idControlAsistenciaDet: number){
    const url = `${URL_BASE}/asistencia/asistencia-det/fijar-cursor?id-asistencia-cab=${idControlAsistenciaCab}&id-asistencia-det=${idControlAsistenciaDet}`;
    return this._httpClient.post<any>(url, null);
  }

  registerCierreDetalle(idControlAsistenciaDet: number){
    const url = `${URL_BASE}/asistencia/cerrar-det/${idControlAsistenciaDet}`;
    return this._httpClient.post<any>(url, null);
  }

  registerCierreDetalleControl(idControlAsistenciaDet: number){
    const url = `${URL_BASE}/asistencia/cerrar-det/${idControlAsistenciaDet}`;
    return this._httpClient.post<any>(url, null);
  }

  registerCierreCabeceraControl(idControlAsistenciaDet: number){
    const url = `${URL_BASE}/asistencia/cerrar-cab/${idControlAsistenciaDet}`;
    return this._httpClient.post<any>(url, null);
  }

  registerCierreTaller(idControlAsistenciaCab: number){
    const url = `${URL_BASE}/asistencia/cerrar-cab/${idControlAsistenciaCab}`;
    return this._httpClient.post<any>(url, null);
  }

  registerContinuacionAsistencia(idControlAsistenciaSubDet: number, continua: boolean){
    const url = `${URL_BASE}/asistencia/continuar-taller?id-asistencia-sub-det=${idControlAsistenciaSubDet}&continua=${continua}`;
    return this._httpClient.post<any>(url, null);
  }

  deleteElegidos(model: number[]){
    const url = `${URL_BASE}/asistencia/eliminar-participante`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(model)
    };

    return this._httpClient.delete<any>(url, httpOptions);
  }

  getListaPreInscritos(idProgDet: number){
    const url = `${URL_BASE}/inscripcion/asegurados-por-participar?id-programacion-det=${idProgDet}`;
    return this._httpClient.get<any>(url);
  }

  registerAsistenciaAsistira(model: RequestRegisterAsistio){
    const url = `${URL_BASE}/inscripcion/asistira`;
    return this._httpClient.post<any>(url, model);
  }
  // --------------------------------------------------------------------------------

  getSiEsApto(model: RequestBuscarApto) {
    if(model.fechaNacimiento){
      let splitFecNac = model.fechaNacimiento.split("-");
      model.fechaNacimiento = splitFecNac[2]+"/"+splitFecNac[1]+"/"+splitFecNac[0]
    }
    const url = `${environment.API}/asegurado/buscar/aptos`;
    return this._httpClient.post<any>(url, model);
  }

  getSiEsAptoNacional(model: RequestBuscarAptoNacional) {
    if(model.fechaNacimiento){
      let splitFecNac = model.fechaNacimiento.split("-");
      model.fechaNacimiento = splitFecNac[2]+"/"+splitFecNac[1]+"/"+splitFecNac[0]
    }
    const url = `${environment.API}/asegurado/buscar/aptos-nacional`;
    return this._httpClient.post<any>(url, model);
  }

  getListAsegurados() {
    let codUo;
    if((JSON.parse(localStorage.getItem('UnidElegida')!)).tipo == 'CIRAM'){
      codUo = (JSON.parse(localStorage.getItem('UnidElegida')!)).unidOperativaCam
    }
    else{
      codUo = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;
    }
    const payload = {
      idUnidadOperativa: codUo,
      texto : '',
      pageNum : 1,
      pageSize : 10
    }
    const url = `${environment.API}/asegurado/buscar/nombres/dt`;
    return this._httpClient.post<any>(url, payload);
  }

  getListAseguradosCiram(idUOCiram: string) {
    const payload = {
      idUnidadOperativa: idUOCiram,
      texto : '',
      pageNum : 1,
      pageSize : 10
    }
    const url = `${environment.API}/asegurado/buscar/nombres/dt/ciram`;
    return this._httpClient.post<any>(url, payload);
  }

  getListAseguradosSoloCam() {
    const payload = {
      idUnidadOperativa:(JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      texto : '',
      pageNum : 1,
      pageSize : 10
    }
    const url = `${environment.API}/asegurado/buscar/nombres/dt/solo-cam`;
    return this._httpClient.post<any>(url, payload);
  }

  getListAseguradosNacional(texto: string, pageNum: number, pageSize: number) {
    const payload = {
      texto,
      pageNum,
      pageSize
    }
    const url = `${environment.API}/asegurado/buscar/nombres/nacional`;
    return this._httpClient.post<any>(url, payload);
  }

  getListAseguradosCiramFindByText(texto: string, pageNum: number, pageSize: number, idUOCiram: string) {
    const payload = {
      idUnidadOperativa: idUOCiram,
      texto,
      pageNum,
      pageSize
    }
    const url = `${environment.API}/asegurado/buscar/nombres/dt/ciram`;
    return this._httpClient.post<any>(url, payload);
  }

  getListAseguradosFindByText(texto: string, pageNum: number, pageSize: number) {

    let codUo;
    if((JSON.parse(localStorage.getItem('UnidElegida')!)).tipo == 'CIRAM'){
      codUo = (JSON.parse(localStorage.getItem('UnidElegida')!)).unidOperativaCam
    }
    else{
      codUo = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;
    }

    const payload = {
      idUnidadOperativa: codUo,
      texto,
      pageNum,
      pageSize
    }
    const url = `${environment.API}/asegurado/buscar/nombres/dt`;
    return this._httpClient.post<any>(url, payload);
  }

  getListAseguradosSoloCamFindByText(texto: string, pageNum: number, pageSize: number) {
    const payload = {
      idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      texto,
      pageNum,
      pageSize
    }
    const url = `${environment.API}/asegurado/buscar/nombres/dt/solo-cam`;
    return this._httpClient.post<any>(url, payload);
  }

  registrarAsistencia(payload: {idAsegurado: string, idProgramacionSubDet: string} ) {
    const url = `${URL_BASE}/registrar/asistencia`;
    return this._httpClient.post<any>(url, payload);
  }

  registrarInscripcion(payload: {
    idFichaAdmision: string,
    idUnidadOperativa: string,
    idProgramacionDet: string,
    acreditado: boolean,
    idUsuarioReg: string,
    conConexion: boolean
  }) 
  {
    const url = `${URL_BASE}/inscripcion/registrar`;
    return this._httpClient.post<any>(url, payload);
  }

  registrarInscripcionAsistenciaRapida(payload: {idAsisSesionRapid : number, idAsegurado: number}){
    const url = `${URL_BASE}/registrar/asistencia-rapida-detalle`;
    return this._httpClient.post<any>(url, payload);
  }

  listarAsistencia(payload: {
    idProgDet: string,
    pageNum: number,
    pageSize: number
  }
   ){

    const url = `${URL_BASE}/listar/inscripcion`;
    return this._httpClient.post<any>(url, payload);

  }

  
  listarAsistenciaRapida(idSesion : number
   ){
    const url = `${URL_BASE}/asistencia-rapida/listar-asistencia-clase/${idSesion}`;
    return this._httpClient.get<any>(url);
  }

  reactivarAsistenciaRapida(idAsisRap : number
  ){
   const url = `${URL_BASE}/asistencia-rapida/reactivar/${idAsisRap}`;
   return this._httpClient.get<any>(url);
 }

 desactivaAsistenciaRapida(idAsisRap : number
 ){
  const url = `${URL_BASE}/asistencia-rapida/eliminar/${idAsisRap}`;
  return this._httpClient.delete<any>(url);
}

  eliminarRegistradosAsistenciaRapida(lista : number[]){
    const url = `${URL_BASE}/asistencia-rapida/eliminar-asegurado`;
    return this._httpClient.post<any>(url, lista);
  }

  eliminarRegistrados(lista : number[]){
    const url = `${URL_BASE}/inscripcion/eliminar`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(lista) // Convertimos el array de números en formato JSON
    };

    return this._httpClient.delete<any>(url, httpOptions);
  }

  actualizarEstadoEliminadoRegistradosHistorico(lista : number[]){
    console.log(lista);
    const url = `${URL_BASE}/asistencia/eliminar-asegurado`;
  
    return this._httpClient.post<any>(url, lista);
  }

  //ASISTENCIA RAPIDA
  getDataAsistenciaRapida(payload: AsistenciaRapidaListaPayload){
    const url = `${environment.API}/control/asistencia-rapida/listar-clases`; 
    return this._httpClient.post<DtGenericoPaginado<ItemListaAsistenciaRapida[]>>(url,payload);
  }

  getDataAsistenciaRapidaProfesionalCam(payload: AsistenciaRapidaListaPayload){
    const url = `${environment.API}/control/asistencia-rapida/listar-clases/profesional-cam`; 
    return this._httpClient.post<DtGenericoPaginado<ItemListaAsistenciaRapida[]>>(url,payload);
  }

  getClaseNacional(model: RequestAdminAsistenciasRap){
    const url = `${URL_BASE}/asistencia-rapida/listar-clases/nacional`;
    return this._httpClient.post<DtGenericoPaginado<ItemListaAsistenciaRapidaNacional[]>>(url,model);
  }

  getClaseNacionalExcel(model: RequestAdminAsistenciasRap): Observable<Blob>{
    const url = `${environment.API}/report/control/excel/asistencia-rapida/lista-nacional`;
    return this._httpClient.post(url, model, {responseType:'blob', headers: new HttpHeaders({'Accept': 'application/octet-stream'})});
  }

  generarReporteClaseNacionalExcel(model: RequestAdminAsistenciasRap){
    const url = `${environment.API}/report/control/generar-reporte/excel/asistencia-rapida-nacional?skipInterceptor=true`;
    let headers = new HttpHeaders();
    headers = headers.set('Skip-Interceptor', 'true');
    return this._httpClient.post<any>(url, model);
  }


  generarExcelAsistenciaRapidaClaseNacional(model: RequestAdminAsistenciasRap): Observable<Blob>{
    const url = `${environment.API}/report/generar-reporte/excel/asistencia-rapida-nacional`;
    return this._httpClient.post(url, model, {responseType:'blob', headers: new HttpHeaders({'Accept': 'application/octet-stream'})});
  }

  // Método para subir un archivo
  subirEvidenciaAsistenciaRapida(file: File, idSesionActual: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const url = `${environment.API}/control/upload-asistencia-rapida-evidencia/${idSesionActual}`;
    return this._httpClient.post(url, formData, {
      headers: new HttpHeaders({ 'Accept': 'application/json' })
    });
  }

  // Método para descargar el archivo
  descargarEvidenciaAsistenciaRapida(idAsistenciaRapida: number): Observable<Blob> {
    const url = `${environment.API}/control/descargar-evidencia-asistencia-rapida/${idAsistenciaRapida}`;
    return this._httpClient.get(url, {
      responseType: 'blob',
      headers: new HttpHeaders({ 'Accept': 'application/octet-stream' })
    });
  }

  obtenerAsistentesAsistenciaRapida(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    const url = `${environment.API}/smartpy/proxy/detect_faces`;
    return this._httpClient.post(url, formData, {
      responseType: 'blob',
      headers: new HttpHeaders({ 'Accept': 'application/octet-stream' })
    });
  }



  //control/inscripcion/registrar
}
