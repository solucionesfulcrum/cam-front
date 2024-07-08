import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TipoParametro } from '@models/parametros-busqueda.model';
import { Observable, delay, of } from 'rxjs';
import { dataRequest, listaFichaSolicitudRequest } from '@models/afiliados/ficha-solicitud.model';
import { Afiliados } from '@models/adm-uo/adm-uo';
import { Http } from '@models/generico/http';
import { ResponseGenerico } from '@models/generico/dt-generico';


const URL_BASE = `${environment.API}/ficha-solicitud`;

@Injectable({
  providedIn: 'root'
})
export class AfiliadoService {

  constructor(private _httpClient: HttpClient) { }

  getFicha(idFicha: string){
    const url = `${URL_BASE}/obtenerPorId/${idFicha}`;
    return this._httpClient.get<any>(url);
  }

  getFichasSolicitud(model: listaFichaSolicitudRequest){
    const url = `${URL_BASE}/listarPorFiltros`;
    return this._httpClient.post<any>(url, model);
  }
  
  searchAndFindData(model: dataRequest){
    const url = `${environment.API}/client/afiliado/getConsultaDatos`
    return this._httpClient.post<any>(url,model);
  }
  getDataPersonaReniec(dni: string){
    const url = `${environment.API}/client/persona/getConsultaDatosRaus/dni/${dni}`
    return this._httpClient.get<any>(url);
  }

  getTipoParametros(tipo: string){
    const url = `${environment.API}/parametros/listarPorTipo?tipo=${tipo}`;
    return this._httpClient.get<TipoParametro>(url);
  }

  getAfiliadoByTipoDoc(tipoDoc: string, numdoc: string){
    const url = `${environment.API}/ficha-admision/buscar/asegurado?tipoDoc=${tipoDoc}&numDoc=${numdoc}`;
    return this._httpClient.get<ResponseGenerico<{idFichaAdmision: string}>>(url);
  }

  getAfiliadosEditCiram(idciram: string) : Observable<Http<Afiliados>>{
    let response = {
      data: [
       
     ]
     
    }

    return of(response).pipe(
      delay(500)
    );
  }
}

