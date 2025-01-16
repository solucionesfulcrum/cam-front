import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InscripcionTalleristaControlService {
  private eventoSubject = new Subject<string>();

  // Observable al que se pueden suscribir los componentes
  evento$ = this.eventoSubject.asObservable();

  // Método para emitir eventos
  emitirEvento(mensaje: string) {
    this.eventoSubject.next(mensaje);
  }
}
