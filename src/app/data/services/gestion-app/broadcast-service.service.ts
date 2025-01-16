import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  private channel = new BroadcastChannel('session_channel');
  private sessionUpdated = new Subject<void>();

  constructor() {
    this.channel.onmessage = (event) => {
      if (event.data === 'update') {
        this.sessionUpdated.next();
      }
    };
  }

  // Método para escuchar el evento desde cualquier componente
  onSessionUpdate() {
    return this.sessionUpdated.asObservable();
  }

  // Método para emitir el evento cuando se inicie sesión
  emitSessionUpdate() {
    this.channel.postMessage('update');
  }
}
