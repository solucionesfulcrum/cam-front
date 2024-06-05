import { Injectable } from '@angular/core';
import { AsistenciasTalleres } from '@models/dashboard/dashboard.model';
import { Http } from '@models/generico/http';
import { Observable, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor() { }

  getDataAsistenciaTalleres(): Observable<Http<AsistenciasTalleres>>{
    let response = {
      data: [
        {
        servicios: "Taller de Empoderamiento ciudadano",
        asistencias: "53,520",
        porcentaje: "28",
      },
      {
        servicios: "Taller de emprendimiento y mejora de capacidades y oportunidades",
        asistencias: "48,120",
        porcentaje: "14",
      },
      {
        servicios: "Taller intergeneracional familia y comunidad",
        asistencias: "38,520",
        porcentaje: "11",
      },
    ]
     
    }

    return of(response).pipe(
      delay(500)
    );
  }
}
