import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Component, LOCALE_ID } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RequestStatus } from '@models/request-status.model';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'esp-tab-asistencia',
  templateUrl: './tab-asistencia.component.html',
  styleUrls: ['./tab-asistencia.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class TabAsistenciaComponent {
  status: RequestStatus = 'init';
  faSpinner = faSpinner;

  ngOnInit(){
    console.log(JSON.parse(localStorage.getItem('idProgramElegida')!))

  }

}
