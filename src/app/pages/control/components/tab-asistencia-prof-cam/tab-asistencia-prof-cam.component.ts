import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Parametro } from '@models/parametros-busqueda.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'esp-tab-asistencia-prof-cam',
  templateUrl: './tab-asistencia-prof-cam.component.html',
  styleUrls: ['./tab-asistencia-prof-cam.component.scss']
})
export class TabAsistenciaProfCamComponent {
  status: RequestStatus = 'init';
  listAsistentes: any[] = [];
  opciones: Parametro[] = [];
  ctrlSearch = new FormControl('');
  ctrlTypeSearch = new FormControl(1);
  public formNewContrato = this.fb.nonNullable.group({
    frmSelectDoc: new FormControl(''),
    frmDoc: ['', [Validators.required, Validators.minLength(8)]],
  });
  faSpinner = faSpinner;
  comienzoSesiones = 1;
  datoProgramacion: any;

  constructor(private fb                                : FormBuilder,
              private router                            : Router,
              private datosService                      : DatosGeneralesService,
              private controlService                    : ControlProgramacionService,
              @Inject(LOCALE_ID) private locale         : string,
              private notificacionService               : NotificationService,
              ) { }

  ngOnInit(){
    console.log(JSON.parse(localStorage.getItem('idProgramElegida')!))
    this.getDataCabecera();
    this.getParametros();
  }

  getParametros(){
    this.datosService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data) =>{
      console.log(data);
      this.opciones = data.data;
    });
  }

  getDataCabecera(){
    this.controlService.getCabeceraProgramacion(JSON.parse(localStorage.getItem('idProgramElegida')!)).subscribe((data)=>{
      if (data.code == 0) {
        this.datoProgramacion = data.data;
        console.log(this.datoProgramacion)
        let seconds = Math.floor((new Date(this.datoProgramacion.fechaServicio + ' ' + this.datoProgramacion.horaFin).getTime() - new Date(this.datoProgramacion.fechaServicio + ' ' + this.datoProgramacion.horaInicio).getTime())/1000);
        let horas = Math.floor(seconds/(60*60));
        let minutos = Math.floor(seconds/60) - horas*60;
        this.datoProgramacion.margenHorario = horas + 'h ' +  minutos + ' m';
        console.log(Math.floor(seconds/(60*60)) + 'h ' +  Math.floor(seconds/60) + ' m')
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })
  }
}
