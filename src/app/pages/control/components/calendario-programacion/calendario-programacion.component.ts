import { Component, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconDefinition, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@services/notification.service';
import localeEs from '@angular/common/locales/es';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import * as fonts from '@fortawesome/free-solid-svg-icons';
import { ProgramacionContratosService } from 'src/app/data/services/programacion/programacion-contratos.service';
import { formatDate, registerLocaleData } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { ConfirmarProgramacionComponent } from '../sub-components/dialogs/confirmar-programacion/confirmar-programacion.component';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { DialogAddProgramacionAsignacionComponent } from '../sub-components/dialogs/dialog-add-programacion-asignacion/dialog-add-programacion-asignacion.component';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

registerLocaleData(localeEs, 'es');

interface SelectOption {
  icon: IconDefinition | null;
  label: string;
  value: any;
}

@Component({
  selector: 'esp-calendario-programacion',
  templateUrl: './calendario-programacion.component.html',
  styleUrls: ['./calendario-programacion.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class CalendarioProgramacionComponent {
  visualizacion: boolean = false;
  

  dropdownOptions: SelectOption[] = [
    { icon: null, label: 'Talleristas', value: 'talleristas' },
    { icon: fonts.faSquare, label: 'Proveedores', value: 'proveedores' },
    { icon: fonts.faSquare, label: 'Nestor Fernando Sosaya Sa... xd', value: 'nestor' },
    { icon: null, label: 'Marco Antonio Camero Mor...', value: 'marco' },
    { icon: null, label: 'Nancy Maria Arrunategui Al...', value: 'nancy1' },
    { icon: null, label: 'Nancy Maria Arrunategui Al...', value: 'nancy2' },
    { icon: null, label: 'Nancy Maria Arrunategui Al...', value: 'nancy3' }
  ];

  idProgramacion!: string;
  faSpinner = faSpinner;
  dataContrato: any;
  dataAsignacionSelected: any;
  listServicios: any;
  listParamTipo: any[] = [];
  listServiciosCiram!: any[];
  dataResumenContrato: any;
  
  faClose = fonts.faClose;
  faSquare = fonts.faSquare;
  fechaActual = new Date();
  fechasSemana: Date[] = [];
  limitesHorario: Date[] = [];
  serviciosAsignados: any[] = [];
  horarios = ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM']
  
  periodoCalendario: Date = new Date();
  
  ctrlProfesionales = new FormControl();
  
  constructor(private activeRoute                           : ActivatedRoute,
              private programacionService                   : ProgramacionContratosService,
              private datosService                          : DatosGeneralesService,
              @Inject(LOCALE_ID) private locale             : string,
              private dialog                                : Dialog,
              private router                                : Router,
              private notificationService                   : NotificationService
  ) { 
    //this.idProgramacion = this.activeRoute.snapshot.paramMap.get('idProgramacion')!;
    this.idProgramacion = "2";
  }

  ngOnInit(){
    this.visualizacion = true;
    this.datosService.getTipoParametros('TIPO_SERVICIO').subscribe((data)=>{
      if (data.code == 0) {
        this.listParamTipo = data.data;
        this.programacionService.getDatosContrato(this.idProgramacion).subscribe((data)=>{
          if (data.code == 0) {
            if (data.data.datosContrato.estadoProgramacionId == 37) {
              this.visualizacion = true;
              //this.opcionesBotones.forEach((x)=> x.deshabilitado = true)
            }
            console.log(data.data)
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
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

  funcionesExtra(opt: number){
    switch (opt) {
      case 0:
        const dialogRef = this.dialog.open(ConfirmarProgramacionComponent,{
          data:{
            title: '¿Está seguro que desea borrar todos los registros de la programación?',
            message: ``,
            dataRequired: this.idProgramacion
          }
        })
        dialogRef.closed.subscribe(result => {
          if (result == 1) {
            this.getDataServiciosAsignados();
            this.getDataResumenContrato();
          }
        });
        break;
      case 1:
        if (this.validacionHorariosCompletos()) {
          const dialogRef = this.dialog.open(ConfirmarProgramacionComponent,{
            data:{
              title: '¿Está seguro de publicar esta programación?',
              message: `De confirmarse, no se podrá volver a editar`,
              dataRequired: this.idProgramacion,
              type: 1
            }
          })
      
          dialogRef.closed.subscribe(result => {
            if (result == 1) {
              this.router.navigate([`app/${AppRoute.PROGRAMACION}/show/${this.idProgramacion}/programados`]);
            }
          });
        }
        break;
    }
  }

  validacionHorariosCompletos(): boolean{
    let valueReturned: boolean = true;console.log(this.listServiciosCiram)
    this.listServicios.servicios.forEach((x: any)=>{
      if (valueReturned) {
        let totalAsignaciones = 0;
        let validacionTotal = 12*this.dataResumenContrato.nroEntregables;
        this.serviciosAsignados.filter((y)=> y.idServicio == x.idServicio).forEach((y)=> totalAsignaciones += y.nroSesiones)
        if (totalAsignaciones < validacionTotal){
          this.notificationService.warning('El servicio ' + x.nombreServicio + ' tiene ' + (validacionTotal - totalAsignaciones) + (validacionTotal - totalAsignaciones == 1 ? ' sesión pendiente' : ' sesiones pendientes' ));
          valueReturned = false;
        }
      }
    })
    
    if (valueReturned) {
      this.listServiciosCiram.forEach((x)=>{
        if (valueReturned) {
          x.servicios.forEach((x: any)=>{
            if (valueReturned) {
              let totalAsignaciones = 0;
              let validacionTotal = 12*this.dataResumenContrato.nroEntregables;
              this.serviciosAsignados.filter((y)=> y.idServicio == x.idServicio).forEach((y)=> totalAsignaciones += y.nroSesiones)
              if (totalAsignaciones < validacionTotal){
                this.notificationService.warning('El servicio ' + x.nombreServicio + ' tiene ' + (validacionTotal - totalAsignaciones) + (validacionTotal - totalAsignaciones == 1 ? ' sesión pendiente' : ' sesiones pendientes' ));
                valueReturned = false;
              }
            }
          })
        }
      })
    }
    return valueReturned;
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
        this.listServiciosCiram = data.data.serviciosCirams;
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

  comprobacionBloqueo(dateElegido: any): boolean{
    if (dateElegido.getDay() == 0 || dateElegido.getDay() == 6 || dateElegido.getTime() < this.limitesHorario[0].getTime() || dateElegido.getTime() > this.limitesHorario[1].getTime()) {
      return true
    }
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
      let listAct = this.serviciosAsignados.find((x: any)=>{return parseInt(x.horaInicio.split(':')[0]) == horaHorario && formatDate(new Date(x.fecha+' '+x.horaInicio), 'yyyy-MM-dd', this.locale) == formatDate(espacios, 'yyyy-MM-dd', this.locale)});
      if (listAct) {
        return true;
      }
      return false;
    }
    return false;
  }
  //______________________________________________________________________________________________________________________________________________________________________________________________ TERMINAR
  // getDataAsignacion(horario: any, espacios: Date): any{
  //   let horaHorario = (horario.split(' ')[1] == 'PM' && horario.split(' ')[0] !== '12') ? parseInt(horario.split(' ')[0]) + 12 : parseInt(horario.split(' ')[0]);
  //   let listAct = this.serviciosAsignados.find((x)=>{return x.horaInicio.split(':')[0] == horaHorario && x.fecha == formatDate(espacios, 'yyyy-MM-dd', this.locale)});    
  //   if (!listAct) return false;
  //   listAct.fechaHorarioInicio  = new Date(listAct.fecha + ' ' + listAct.horaInicio);
  //   let fechaFin = new Date(listAct.fecha + ' ' + listAct.horaFin);
  //   let longitudHoras = ((fechaFin.getTime() - listAct.fechaHorarioInicio.getTime()) / (1000*60))/60;
  //   listAct.controlarInicio = (((new Date(listAct.fecha + ' ' + listAct.horaInicio)).getMinutes())/60)*40;
  //   listAct.longitud = longitudHoras*40;
  //   return listAct;
  // }
  getDataAsignacion(horario: any, espacios: Date): any{
    let horaHorario = (horario.split(' ')[1] == 'PM' && horario.split(' ')[0] !== '12') ? parseInt(horario.split(' ')[0]) + 12 : parseInt(horario.split(' ')[0]);
    let listAct: any[] = [];
    listAct = this.serviciosAsignados.filter((x)=>{return x.horaInicio.split(':')[0] == horaHorario && x.fecha == formatDate(espacios, 'yyyy-MM-dd', this.locale)});
    if (listAct.length == 0) return listAct;
    listAct.forEach((x)=>{
      x.fechaHorarioInicio  = new Date(x.fecha + ' ' + x.horaInicio);
      let fechaFin = new Date(x.fecha + ' ' + x.horaFin);
      let longitudHoras = ((fechaFin.getTime() - x.fechaHorarioInicio.getTime()) / (1000*60))/60;
      x.controlarInicio = (((new Date(x.fecha + ' ' + x.horaInicio)).getMinutes())/60)*40;
      x.longitud = longitudHoras*40;
    })
    return listAct;
  }
  //______________________________________________________________________________________________________________________________________________________________________________________________ TERMINAR

  verifyData(dataRangoElegido: any, dataFechaElegida: any, event: MouseEvent){
    event.stopPropagation();
    let asignacion = false;
    if (!asignacion) {
      this.showScheduleCalendar(dataRangoElegido, dataFechaElegida);
      return false
    }
    else{
      return true
    }
  }
  
  getDataServiceAsignadoSelected(idProgramacionDet: any, event: MouseEvent){
    event.stopPropagation();
    this.dataAsignacionSelected = null;
    this.programacionService.getDataAsignacionServicioSelected(idProgramacionDet).subscribe((data)=>{
      if (data.code == 0) {
        this.dataAsignacionSelected = data.data;
        this.dataAsignacionSelected.idProgramacionDet = idProgramacionDet;
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

  showScheduleCalendar(dataRangoElegido: any, dataFechaElegida: any){
    if (!this.visualizacion) {
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
            serviciosCiram:               this.listServiciosCiram,
            dataRangosHorarios:           this.horarios,
            paramTipo:                    this.listParamTipo,
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

  editAsignacion(dataRangoElegido: any, dataFechaElegida: any, data: any){
    const dialogRef = this.dialog.open(DialogAddProgramacionAsignacionComponent,{
      minWidth:'400px',
      width:'60vw',
      maxWidth:'800px',
      data:{
        idProgramacion:               this.idProgramacion,
        datoEdicion:                  data,
        rangoHorario:                 dataRangoElegido,
        fechaHorario:                 dataFechaElegida,
        dataContrato:                 this.dataContrato,
        infoServiciosContratados:     this.serviciosAsignados,
        serviciosContrato:            this.listServicios,
        serviciosCiram:               this.listServiciosCiram,
        dataRangosHorarios:           this.horarios,
        paramTipo:                    this.listParamTipo,
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

  deleteAsignacion(idProgramacionDet: any){
    this.programacionService.deleteAsignacionId(idProgramacionDet).subscribe((data)=>{
      if (data.code == 0) {
        this.getDataServiciosAsignados();
        this.getDataResumenContrato();
        this.notificationService.success('Se eliminó la asignación satisfactoriamente');
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }
}
