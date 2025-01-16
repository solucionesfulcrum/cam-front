import { DataSource } from '@angular/cdk/collections';
import { User } from '@models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { UnidadOperativa, iUserTable } from 'src/app/interfaces/unit.op.interface';

export class DataSourceList extends DataSource<UnidadOperativa> {

  data = new BehaviorSubject<UnidadOperativa[]>([]);
  originalData: UnidadOperativa[]= [];

  connect(): Observable<UnidadOperativa[]> {
    return this.data;
  }

  init(data: UnidadOperativa[]) {
    this.originalData = data;
    this.data.next(data);
  }

  disconnect() { }

}
