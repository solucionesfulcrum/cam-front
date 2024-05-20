import { DataSource } from '@angular/cdk/collections';
import { AsistenciaLista } from '@models/control/asistencia/crud-asistencia.model';
import { User } from '@models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';


export class DataSourceList extends DataSource<AsistenciaLista> {

  data = new BehaviorSubject<AsistenciaLista[]>([]);
  originalData: AsistenciaLista[]= [];

  connect(): Observable<AsistenciaLista[]> {
    return this.data;
  }

  init(data: AsistenciaLista[]) {
    this.originalData = data;
    this.data.next(data);
  }

  disconnect() { }

}
