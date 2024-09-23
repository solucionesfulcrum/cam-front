import { DataSource } from '@angular/cdk/collections';
import { AsistenciaLista, AsistenciaRapidaLista } from '@models/control/asistencia/crud-asistencia.model';
import { User } from '@models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';


export class DataSourceList extends DataSource<AsistenciaRapidaLista> {

  data = new BehaviorSubject<AsistenciaRapidaLista[]>([]);
  originalData: AsistenciaRapidaLista[]= [];

  connect(): Observable<AsistenciaRapidaLista[]> {
    return this.data;
  }

  init(data: AsistenciaRapidaLista[]) {
    this.originalData = data;
    this.data.next(data);
  }

  disconnect() { }

}
