import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';


const URL_BASE = `${environment.API}`;

@Injectable({
  providedIn: 'root'
})
export class ReportesTalleristaService {

  constructor() { }
}
