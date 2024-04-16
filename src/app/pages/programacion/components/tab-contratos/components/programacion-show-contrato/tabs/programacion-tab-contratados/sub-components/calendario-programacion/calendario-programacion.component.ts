import { Component, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@services/notification.service';
import localeEs from '@angular/common/locales/es';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import * as fonts from '@fortawesome/free-solid-svg-icons';
import { ProgramacionContratosService } from 'src/app/data/services/programacion/programacion-contratos.service';
import { registerLocaleData } from '@angular/common';
import { FormControl } from '@angular/forms';
import { DialogAddProgramacionAsignacionComponent } from '../dialogs/dialog-add-programacion-asignacion/dialog-add-programacion-asignacion.component';
import { Dialog } from '@angular/cdk/dialog';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'esp-calendario-programacion',
  templateUrl: './calendario-programacion.component.html',
  styleUrls: ['./calendario-programacion.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class CalendarioProgramacionComponent {
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Guardar', colorBtn:'bordeado'},
    {texto: 'Guardar y publicar', colorBtn:'mezclado', esImagen: true, rutaIcono: 'assets/svg/icon-white-save.svg'},
  ];
  numOc!: string;
  faSpinner = faSpinner;
  dataContrato: any;
  
  faClose = fonts.faClose;
  fechaActual = new Date();
  fechasSemana: Date[] = [];
  limitesHorario: Date[] = [];
  horarios = ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM']
  
  periodoCalendario: Date = new Date();
  
  ctrlProfesionales = new FormControl();
  
  constructor(private activeRoute                           : ActivatedRoute,
              private programacionService                   : ProgramacionContratosService,
              private dialog                                : Dialog,
              private router                                : Router,
              private notificationService                   : NotificationService
  ) { 
    this.numOc = this.activeRoute.snapshot.paramMap.get('numOc')!;
  }

  ngOnInit(){
    this.programacionService.getDatosContrato(this.numOc).subscribe((data)=>{
      if (data.code == 0) {
        this.limitesHorario.push(new Date(data.data.datosContrato.fechInicio.replace(/-/g, '\/')));
        this.limitesHorario.push(new Date(data.data.datosContrato.fechFin.replace(/-/g, '\/')));
        this.periodoCalendario.setMonth(this.limitesHorario[0].getMonth());
        this.periodoCalendario.setFullYear(this.limitesHorario[0].getFullYear());
        this.getFechasSemana(new Date(this.limitesHorario[0].getFullYear(), this.limitesHorario[0].getMonth(), this.limitesHorario[0].getDate()));
        this.dataContrato = data.data;
        this.ctrlProfesionales.setValue(1);
        console.log(this.dataContrato)
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

  funcionesExtra(opt: number){
    switch (opt) {
      case 0:

        break;
      case 1:

        break;
    }
  }

  comprobacionBloqueo(dateElegido: any): boolean{
    if (dateElegido.getDay() == 0 || dateElegido.getDay() == 6 || dateElegido.getTime() < this.limitesHorario[0].getTime() || dateElegido.getTime() > this.limitesHorario[1].getTime()/*!(dateElegido.getMonth() == this.periodoCalendario.getMonth() && dateElegido.getFullYear() == this.periodoCalendario.getFullYear())*/) {
      return true
    }
    // else if (this.profesionalElegido ? (this.profesionalElegido.rangoDias == 'L-V' && dateElegido.getDay() == 6) : dateElegido.getDay() == 6){
    //   return true
    // }
    return false
  }

  changeDates(opt: number){
    if (opt == 1) {
      this.getFechasSemana(new Date(this.fechasSemana[this.fechasSemana.length-1].valueOf() + 1000*60*60*24));
    }
    else{
      this.getFechasSemana(new Date(this.fechasSemana[0].valueOf() - 1000*60*60*24));
    }
  }

  getFechasSemana(fechaEvaluar: Date){
    this.fechasSemana = [];

    let diaInicio = new Date(fechaEvaluar.getTime() - 1000*60*60*24*fechaEvaluar.getDay());
    for (let i = 0; i < 7; i++) {
      this.fechasSemana.push(diaInicio);
      diaInicio = new Date(diaInicio.getTime() + 1000*60*60*24);
    }
  }

  verifyData(dataRangoElegido: any, dataFechaElegida: any){
    // let asignacion = this.getDataAsignacion(dataRangoElegido, dataFechaElegida);
    // if (!asignacion) {
      this.showScheduleCalendar(dataRangoElegido, dataFechaElegida);
    //   return false
    // }
    // else{
    //   this.dataAsignacionSelected = asignacion;
    //   let actividadInfo = this.admisionCitasServicio.actividadesInfo.find((x)=>{return x.nombreActividad === asignacion.obj.actividad});
    //   let horaIncremental = 0;
    //   let fechaIncremental = this.dataAsignacionSelected.obj.inicioActividad;
    //   do {
    //     fechaIncremental = new Date(fechaIncremental.getTime() +  (1000*60*actividadInfo!.tiempo));
    //     horaIncremental += 1;
    //   } while (fechaIncremental.getTime() != this.dataAsignacionSelected.obj.terminaActividad.getTime());
    //   this.dataAsignacionSelected.tiempoSesion = actividadInfo?.tiempo;
    //   this.dataAsignacionSelected.sesiones = horaIncremental;
    //   return true
    // }
  }

  showScheduleCalendar(dataRangoElegido: any, dataFechaElegida: any){
    if (this.fechasSemana.some((x)=>{return (x.getMonth() == this.periodoCalendario.getMonth() && x.getFullYear() == this.periodoCalendario.getFullYear())})) {
      const dialogRef = this.dialog.open(DialogAddProgramacionAsignacionComponent,{
        minWidth:'400px',
        width:'60vw',
        maxWidth:'800px',
        data:{
          numOc:              this.numOc,
          rangoHorario:       dataRangoElegido,
          fechaHorario:       dataFechaElegida,
          dataContrato:        this.dataContrato,
          dataRangosHorarios: this.horarios,
          semanaElegida:      this.fechasSemana,
          horarioFijo:        (dataRangoElegido ? true : false)
        }
      })        
    }
    else{
      this.notificationService.warning('Este horario no corresponde al mes a programar');
    }
  }


}
