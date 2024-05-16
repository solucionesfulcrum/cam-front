import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'esp-tab-asistencia',
  templateUrl: './tab-asistencia.component.html',
  styleUrls: ['./tab-asistencia.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class TabAsistenciaComponent {
  status: RequestStatus = 'init';
  ctrlSearch = new FormControl('');
  faSpinner = faSpinner;
  comienzoSesiones = 1;
  datoProgramacion: any;

  constructor(private router                            : Router,
              private controlService                    : ControlProgramacionService,
              @Inject(LOCALE_ID) private locale         : string,
              private notificacionService               : NotificationService,
              ) { }

  ngOnInit(){
    console.log(JSON.parse(localStorage.getItem('idProgramElegida')!))
    this.getDataCabecera();
  }

  getDataCabecera(){
    this.controlService.getCabeceraProgramacion(JSON.parse(localStorage.getItem('idProgramElegida')!)).subscribe((data)=>{
      if (data.code == 0) {
        this.datoProgramacion = data.data;
        console.log(this.datoProgramacion)
        let seconds = Math.floor((new Date(this.datoProgramacion.fechaServicio + ' ' + this.datoProgramacion.horaFin).getTime() - new Date(this.datoProgramacion.fechaServicio + ' ' + this.datoProgramacion.horaInicio).getTime())/1000);
        this.datoProgramacion.margenHorario = Math.floor(seconds/(60*60)) + 'h ' +  Math.floor(seconds/60) + ' m';
        console.log(Math.floor(seconds/(60*60)) + 'h ' +  Math.floor(seconds/60) + ' m')
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })
  }

}
