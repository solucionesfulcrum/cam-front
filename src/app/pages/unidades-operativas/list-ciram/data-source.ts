import { DataSource } from '@angular/cdk/collections';
import { User } from '@models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { UnidadOperativa, UnidadOperativaCiram, iUserTable } from 'src/app/interfaces/unit.op.interface';

export class DataSourceListCiram extends DataSource<UnidadOperativaCiram> {

  data = new BehaviorSubject<UnidadOperativaCiram[]>([]);
  originalData: UnidadOperativaCiram[]= [];

  connect(): Observable<UnidadOperativaCiram[]> {
    return this.data;
  }

  init(data: UnidadOperativaCiram[]) {
    this.originalData = data;
    this.data.next(data);
  }

  disconnect() { }

}
