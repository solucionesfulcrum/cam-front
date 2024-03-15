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
    const url = `${environment.API}/client/afiliado/sagw-qa-identapi-v2/busqueda?tipodoc=${tipoDoc}&numerodocumento=${numDoc}&busqueda=2&codigo=0H2YU123&file=1`
    return this._httpClient.get<any>(url);
  }

  //Servicios SIGPS -------------------------------------------------------------------------------------------------------
  getDatoSeguro(tipo: string, numDoc: string){
    const url = `https://apps.essalud.gob.pe/sagw/sigps/viva-apidatosmaestros/ASEGURADO/Buscar?VS_TIPODOCUME=${tipo}&VS_NRODOCUMEN=${numDoc}`;
    return this._httpClient.get<any>(url);
  }

  searchUnidadOperativa(tipo: string, text: string){ //Obtener lista de CERPS
    const url = `https://appsqa.essalud.gob.pe/sigps-service/unidad-operativa/listarPorTipo/${tipo}?texto=${text}`;
    return this._httpClient.get<any>(url);
  }

  //----------------------------------------------------------------------------------------------------------------------
}
