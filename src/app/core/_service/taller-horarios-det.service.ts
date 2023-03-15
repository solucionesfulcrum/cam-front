import { BuscarTallerCabDTO } from './../_DTO/buscar-taller-cab-dto';
import { HttpClient } from '@angular/common/http';
import { TallerHorariosDet } from './../_model/taller-horarios-det';
import { CRUDService } from './crud.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TallerHorariosDetService extends CRUDService<TallerHorariosDet>{

  constructor(protected override _http: HttpClient) {
    super(
      _http,
      `${environment.HOST}/taller-horarios-det`
    )
   }

   buscarPorTallerTalleristaFecha(buscarTallerCabDTO: BuscarTallerCabDTO){
    let url = `${environment.HOST}/taller-horarios-det/buscar`
    return this._http.post<TallerHorariosDet[]>(url, buscarTallerCabDTO);
   }

}
