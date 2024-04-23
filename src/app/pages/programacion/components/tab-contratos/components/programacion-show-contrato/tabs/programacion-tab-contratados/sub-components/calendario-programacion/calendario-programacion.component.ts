import { Component, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@services/notification.service';
import localeEs from '@angular/common/locales/es';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import * as fonts from '@fortawesome/free-solid-svg-icons';
import { ProgramacionContratosService } from 'src/app/data/services/programacion/programacion-contratos.service';
import { formatDate, registerLocaleData } from '@angular/common';
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
  idProgramacion!: string;
  faSpinner = faSpinner;
  dataContrato: any;
  dataAsignacionSelected: any;
  listServicios: any;
  dataResumenContrato: any;
  
  faClose = fonts.faClose;
  fechaActual = new Date();
  fechasSemana: Date[] = [];
  limitesHorario: Date[] = [];
  serviciosAsignados: any[] = [];
  horarios = ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM']
  
  periodoCalendario: Date = new Date();
  
  ctrlProfesionales = new FormControl();
  
  constructor(private activeRoute                           : ActivatedRoute,
              private programacionService                   : ProgramacionContratosService,
              @Inject(LOCALE_ID) private locale             : string,
              private dialog                                : Dialog,
              private router                                : Router,
              private notificationService                   : NotificationService
  ) { 
    this.idProgramacion = this.activeRoute.snapshot.paramMap.get('idProgramacion')!;
  }

  ngOnInit(){
    this.programacionService.getDatosContrato(this.idProgramacion).subscribe((data)=>{
      if (data.code == 0) {
        this.limitesHorario.push(new Date(data.data.datosContrato.fechInicio.replace(/-/g, '\/')));
        this.limitesHorario.push(new Date(data.data.datosContrato.fechFin.replace(/-/g, '\/')));
        this.periodoCalendario.setMonth(this.limitesHorario[0].getMonth());
        this.periodoCalendario.setFullYear(this.limitesHorario[0].getFullYear());
        this.getFechasSemana(new Date(this.limitesHorario[0].getFullYear(), this.limitesHorario[0].getMonth(), this.limitesHorario[0].getDate()));
        this.dataContrato = data.data.datosContrato;
        this.getDataResumenContrato();
        this.getServiciosContrato()
        this.getDataServiciosAsignados();
        this.ctrlProfesionales.setValue(1);
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

  getDataResumenContrato(){
    this.programacionService.getResumenInferiorProgramacion(this.dataContrato.idProgramacion).subscribe((data)=>{
      if (data.code == 0) {
        this.dataResumenContrato = data.data;
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

  getDataServiciosAsignados(){
    this.programacionService.getServiciosProgramadosContrato(this.dataContrato.idProgramacion).subscribe((data)=>{
      if (data.code == 0) {
        console.log(data.data)
        this.serviciosAsignados = data.data;
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

  getServiciosContrato(){
    this.programacionService.getDatosServicioContrato(this.dataContrato.idProgramacion).subscribe((data)=>{
      if (data.code == 0) {
        this.listServicios = data.data.serviciosCam;
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
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
  //______________________________________________________________________________________________________________________________________________________________________________________________ TERMINAR
  validarActividadRegistrada(horario: any, espacios: Date): boolean{
    if (this.serviciosAsignados.length > 0){
      let horaHorario = (horario.split(' ')[1] == 'PM' && horario.split(' ')[0] !== '12') ? parseInt(horario.split(' ')[0]) + 12 : parseInt(horario.split(' ')[0]);
      let listAct = this.serviciosAsignados.find((x: any)=>{return parseInt(x.horaInicio.split(':')[0]) == horaHorario && (new Date(x.fecha+' '+x.horaInicio)).getDate() == espacios.getDate()});
      // let listAct = this.profesionalElegido.actividadesAsignadas.find((x: any)=>{return x.inicioActividad.getDate() == espacios.getDate() && x.inicioActividad.getHours() == horaHorario});
      if (listAct) {
        // console.log(listAct)
        // if (!this.listHorariosAsignados.some((x)=>{return x.obj == listAct && x.horario == horario && x.fecha == espacios})) this.listHorariosAsignados.push({horario: horario, fecha: espacios, obj: listAct, profesional: {idProf: this.profesionalElegido.idProfesional, nomProf: this.profesionalElegido.nomProfesional}});
        return true;
      }
      return false;
    }
    return false;
  }
  //______________________________________________________________________________________________________________________________________________________________________________________________ TERMINAR
    getDataAsignacion(horario: any, espacios: Date): any{
      let horaHorario = (horario.split(' ')[1] == 'PM' && horario.split(' ')[0] !== '12') ? parseInt(horario.split(' ')[0]) + 12 : parseInt(horario.split(' ')[0]);
      let listAct = this.serviciosAsignados.find((x)=>{return x.horaInicio.split(':')[0] == horaHorario && x.fecha == formatDate(espacios, 'yyyy-MM-dd', this.locale)});
      if (!listAct) return false;
      listAct.fechaHorarioInicio  = new Date(listAct.fecha + ' ' + listAct.horaInicio);
      let fechaFin = new Date(listAct.fecha + ' ' + listAct.horaFin);
      let longitudHoras = ((fechaFin.getTime() - listAct.fechaHorarioInicio.getTime()) / (1000*60))/60;
      listAct.longitud = longitudHoras*40;
      return listAct;
    }
  //______________________________________________________________________________________________________________________________________________________________________________________________ TERMINAR

  verifyData(dataRangoElegido: any, dataFechaElegida: any){
    let asignacion = this.getDataAsignacion(dataRangoElegido, dataFechaElegida);
    if (!asignacion) {
      this.showScheduleCalendar(dataRangoElegido, dataFechaElegida);
      return false
    }
    else{
      return true
    }
  }
  
  getDataServiceAsignadoSelected(idProgramacionDet: any){
    this.dataAsignacionSelected = null;
    this.programacionService.getDataAsignacionServicioSelected(idProgramacionDet).subscribe((data)=>{
      if (data.code == 0) {
        this.dataAsignacionSelected = data.data;
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

  showScheduleCalendar(dataRangoElegido: any, dataFechaElegida: any){
    if (this.fechasSemana.some((x)=>{ return !this.comprobacionBloqueo(x)})) {
      const dialogRef = this.dialog.open(DialogAddProgramacionAsignacionComponent,{
        minWidth:'400px',
        width:'60vw',
        maxWidth:'800px',
        data:{
          idProgramacion:               this.idProgramacion,
          rangoHorario:                 dataRangoElegido,
          fechaHorario:                 dataFechaElegida,
          dataContrato:                 this.dataContrato,
          infoServiciosContratados:     this.serviciosAsignados,
          serviciosContrato:            this.listServicios,
          dataRangosHorarios:           this.horarios,
          semanaElegida:                this.fechasSemana,
          horarioFijo:                  (dataRangoElegido ? true : false)
        }
      })
      dialogRef.closed.subscribe(result => {
        if (result == 1) {
          this.getDataServiciosAsignados();
          this.getDataResumenContrato();
        }
      });    
    }
    else{
      this.notificationService.warning('Este horario no corresponde al mes a programar');
    }
  }


}
