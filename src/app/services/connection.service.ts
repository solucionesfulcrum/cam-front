import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private connectionStatus = new BehaviorSubject<boolean>(true);
  connectionStatus$ = this.connectionStatus.asObservable();

  updateConnectionStatus(isConnected: boolean): void {
    this.connectionStatus.next(isConnected);
  }
}
