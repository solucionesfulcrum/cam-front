import { DataSource } from '@angular/cdk/collections';
import { User } from '@models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { iUserTable } from 'src/app/interfaces/user-table.interface';

export class DataSourceUser extends DataSource<iUserTable> {

  data = new BehaviorSubject<iUserTable[]>([]);
  originalData: iUserTable[]= [];

  connect(): Observable<iUserTable[]> {
    return this.data;
  }

  init(data: iUserTable[]) {
    this.originalData = data;
    this.data.next(data);
  }

  disconnect() { }

}
