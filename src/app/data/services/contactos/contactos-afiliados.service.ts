import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestEditFicha } from '@models/afiliados/edit-ficha-solicitud';
import { dataRequest } from '@models/afiliados/ficha-solicitud.model';
import { registerFichaRequest } from '@models/afiliados/register-ficha-solicitud';
import { environment } from 'src/environments/environment';

const URL_BASE = `${environment.API}/contatos`;

@Injectable({
  providedIn: 'root'
})
export class ContactosAfiliadosService {

  constructor(private _httpClient: HttpClient) { }

  getNumeroHistoria(idUnidad: string){
    const url = `${environment.API}/ficha-admision/getNewNumHistoria/${idUnidad}`;
    return this._httpClient.get<any>(url);
  }

  registerFichaAsegurado(model: registerFichaRequest){
    const url = `${environment.API}/ficha-admision/registrar`;
    return this._httpClient.post<any>(url,model);
  }

  editFichaAsegurado(idFicha: string, model: RequestEditFicha){
    const url = `${environment.API}/ficha-admision/actualizar/${idFicha}`;
    return this._httpClient.post<any>(url,model);
  }

  obtenerFichaAsegurado(idFicha: string){
    const url = `${environment.API}/ficha-admision/${idFicha}`;
    return this._httpClient.get<any>(url);
  }

  servicioObtenerCodCentro(model: dataRequest){
    const url = `${environment.API}/client/afiliado/getConsultaDatos`;
    return this._httpClient.post<any>(url,model);
  }

  servicioObtenerDataPersona(tipoDoc: any, numDoc: any){
    const url = `${environment.API}/client/afiliado/sagw-qa-identapi-v2/busqueda?tipodoc=${tipoDoc}&numerodocumento=${numDoc}&busqueda=1&codigo=0H2YU123&file=1`
    return this._httpClient.get<any>(url);
  }

  
  ServicioObetenerDataPersonaNoDni(model : {codOpcion: number, codTipDoc: string, numDoc: string, fecNacimiento: string}){
    const url = `${environment.API}/client/afiliado/sgss-paciente-map-ficha-afiliado`;
    return this._httpClient.post<any>(url, model);
  }

  getDatoSeguro(tipo: string, numDoc: string){
    const url = `${environment.API}/client/afiliado/viva-mestros-asegurado?tipoDoc=${tipo}&nroDoc=${numDoc}`;
    return this._httpClient.get<any>(url);
  }

  darDeBajaAsegurado(data : {idFichaAdmision: string, idMotivoBaja: number, descMotivoBaja: string, idUsuarioReg: string} ){
    const url = `${environment.API}/ficha-admision/baja`;
    return this._httpClient.post<any>(url,data);
  }

  cambiarDeEstado(data : {idFichaAdmision: string, idEstado: number} ){
    const url = `${environment.API}/ficha-admision/change/estado`;
    return this._httpClient.post<any>(url,data);
  }

  corregirUbigeo(data : {tipo: string, codUbigeo: string, idAsegurado: string, idFichaAdmision: string} ){
    const url = `${environment.API}/utilidades/corregir-desc-nacimiento`;
    return this._httpClient.post<any>(url,data);
  }

  //Servicios SIGPS -------------------------------------------------------------------------------------------------------

  searchUnidadOperativa(tipo: string, text: string){ //Obtener lista de CERPS
    const url = `${environment.API}/client/sigps/unidad-operativa/listar-cerps?texto=${text}`;
    return this._httpClient.get<any>(url);
  }

  //----------------------------------------------------------------------------------------------------------------------
}
