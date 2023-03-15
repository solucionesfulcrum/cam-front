import { HttpClient } from '@angular/common/http';
import { TallerHorariosCab } from './../_model/taller-horarios-cab';
import { CRUDService } from './crud.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BuscarTallerCabDTO } from '../_DTO/buscar-taller-cab-dto';

@Injectable({
  providedIn: 'root'
})
export class TallerHorariosCabService extends CRUDService<TallerHorariosCab>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/taller-horarios-cab`
    );
   }
  //  buscarPorTallerTalleristaFecha(idTaller: number, idPersona: number, fecha: string){
  //   let url = `${environment.HOST}/taller-horarios-cab/${idTaller}/${idPersona}/${fecha}`
  //   return this._http.get<TallerHorariosCab>(url);
  //  }
  buscarPorTallerTalleristaFecha(buscarTallerCabDTO: BuscarTallerCabDTO){
    let url = `${environment.HOST}/taller-horarios-cab/buscar`
    return this._http.post<TallerHorariosCab>(url, buscarTallerCabDTO);
   }
  }
