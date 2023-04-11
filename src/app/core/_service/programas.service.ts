import { HttpClient } from '@angular/common/http';
import { Programa } from '../_model/programa.model';
import { CRUDService } from './crud.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { SubPrograma } from '../_model/sub-programa.model';
import { Servicios } from '../_model/servicios.model';

@Injectable({
  providedIn: 'root',
})
export class ProgramasService extends CRUDService<Programa> {
  constructor(protected override _http: HttpClient) {
    super(_http, `${environment.HOST}/programa`);
  }

  listarProgramas() {
    return this._http
      .get<Programa[]>(`${environment.HOST}/programa/programa`, {
        reportProgress: true, // this is importante!
      })
      .pipe(
        map((data: any) => {
          data = data.map((item: any) => ({
            idPrograma: item['idasignatura'],
            descripcion: item['descasignatura'],
          }));
          return data;
        })
      );
  }

  listarSubProgramas(idPrograma: string) {
    return this._http
      .get<SubPrograma[]>(
        `${environment.HOST}/programa/subprograma/${idPrograma}`,
        {
          reportProgress: true, // this is importante!
        }
      )
      .pipe(
        map((data: any) => {
          data = data.map((item: any) => ({
            idSubPrograma: item['idasignatura'],
            descripcion: item['descasignatura'],
          }));
          return data;
        })
      );
  }

  listarServicios(idPrograma: string, idSubPrograma: string) {
    return this._http
      .get<Servicios[]>(
        `${environment.HOST}/programa/asignatura/${idPrograma}/${idSubPrograma}`,
        {
          reportProgress: true, // this is importante!
        }
      )
      .pipe(
        map((data: any) => {
          data = data.map((item: any) => ({
            idServicio: item['idasignatura'],
            cant_servicios:0, 
            descripcion: item['descasignatura'],
          }));
          return data;
        })
      );
  }
}
