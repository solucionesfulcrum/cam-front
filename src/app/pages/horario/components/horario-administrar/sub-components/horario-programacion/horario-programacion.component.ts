import { Component, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HorarioAdministracionService } from '@services/horario/horario-administracion.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import localeEs from '@angular/common/locales/es';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { registerLocaleData } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { DialogScheduleCalendarComponent } from '../dialogs/dialog-schedule-calendar/dialog-schedule-calendar.component';
import { NotificationService } from '@services/notification.service';
import * as fonts from '@fortawesome/free-solid-svg-icons';
import { AdmisionCitasService } from '@services/admision/admision-citas.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'esp-horario-programacion',
  templateUrl: './horario-programacion.component.html',
  styleUrls: ['./horario-programacion.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class HorarioProgramacionComponent {
  faSpinner = faSpinner;
  wait = false;

  faClose = fonts.faClose;
  fechaActual = new Date();
  fechasSemana: Date[] = [];
  horarios = ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM']

  idHorarioProgramado: any;
  listProfesionales: any[] = [];

  periodoCalendario: Date = new Date();
  listHorariosAsignados: any[] = [];
  dataAsignacionSelected: any = Object();

  calendarioDatos: any = Object();

  ctrlProfesionales = new FormControl();
  profesionalElegido: any = null;
  profesionalDatosResumen: any = null;
  profesionalAsignaciones: any = null;


  opcionesBotones: FormatoBoton[] = [
    {texto: 'Guardar'},
    {texto: 'Guardar y publicar', colorBtn:'mezclado', esImagen: true, rutaIcono: 'assets/svg/icon-white-save.svg'},
  ];

  constructor(private router                            : Router,
              private activeRoute                       : ActivatedRoute,
              private notificationService               : NotificationService,
              private dialog                            : Dialog,
              private admisionCitasServicio             : AdmisionCitasService,
              private horariosServicio                  : HorarioAdministracionService) {
      this.idHorarioProgramado = this.activeRoute.snapshot.paramMap.get('idHorario')!;
    }

  ngOnInit(){
    this.getHorarioData()

    this.ctrlProfesionales.valueChanges.subscribe((data)=>{
      this.profesionalElegido = data;
      this.profesionalDatosResumen = null;
      this.profesionalAsignaciones = null;
      console.log(data)
      this.horariosServicio.getDataResumenProfesional(this.idHorarioProgramado, data.profesionalId).subscribe((datos)=>{
        if (datos.code == 0) {
          this.profesionalDatosResumen = datos.data.datosResumen;
          console.log(datos)
        }
        else{
          this.notificationService.warning(datos.message);
        }
      })
      this.horariosServicio.getDataPlanificacionProfesional(this.idHorarioProgramado, data.profesionalId).subscribe((datos)=>{
        if (datos.code == 0) {
          let profesionalListado = this.horariosServicio.horarioRegistrado.listProfesionales.find((x)=>{return x.idProfesional == data.profesionalId});
          if (profesionalListado){
            datos.data.forEach((x: any)=>{
              if (!profesionalListado.asignaciones.find((k: any)=>{return k.horarioPlanificacionId == x.horarioPlanificacionId})){
                profesionalListado.asignaciones.push(x)
              }
            })
          }
          else{
            this.horariosServicio.horarioRegistrado.listProfesionales.push({idProfesional: data.profesionalId, asignaciones: datos.data});
          }
          this.profesionalAsignaciones = this.horariosServicio.horarioRegistrado.listProfesionales.find((x)=>{return x.idProfesional == data.profesionalId});
          console.log(this.profesionalAsignaciones)
        }
        else{
          this.notificationService.warning(datos.message);
        }
      })
    })
  }

  getHorarioData(){
    this.horariosServicio.getDataHorario(this.idHorarioProgramado).subscribe((data)=>{
      if (data.code == 0) {
        this.horariosServicio.horarioRegistrado.idHorario = this.idHorarioProgramado;
        this.horariosServicio.horarioRegistrado.listProfesionales = [];
        console.log(data)
        this.calendarioDatos = data.data;
        this.listProfesionales = data.data.profesionales;
        this.periodoCalendario.setMonth(data.data.mesId-1);
        this.periodoCalendario.setFullYear(data.data.anio);
        this.getFechasSemana(new Date(data.data.anio, data.data.mesId-1, 1));
        this.wait = true;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  printValue(value: any, value2: any){
    console.log(value, value2)
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
    if (dateElegido.getDay() == 0 || !(dateElegido.getMonth() == this.periodoCalendario.getMonth() && dateElegido.getFullYear() == this.periodoCalendario.getFullYear())) {
      return true
    }
    else if (this.profesionalElegido ? (this.profesionalElegido.rangoDias == 'L-V' && dateElegido.getDay() == 6) : dateElegido.getDay() == 6){
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
    if (this.profesionalAsignaciones.asignaciones.length > 0){
      let horaHorario = (horario.split(' ')[1] == 'PM' && horario.split(' ')[0] !== '12') ? parseInt(horario.split(' ')[0]) + 12 : parseInt(horario.split(' ')[0]);
      let listAct = this.profesionalAsignaciones.asignaciones.find((x: any)=>{return parseInt(x.horaInicio.split(':')[0]) == horaHorario && (new Date(x.fecha+' '+x.horaInicio)).getDate() == espacios.getDate()});
      // let listAct = this.profesionalElegido.actividadesAsignadas.find((x: any)=>{return x.inicioActividad.getDate() == espacios.getDate() && x.inicioActividad.getHours() == horaHorario});
      if (listAct) {
        console.log(listAct)
        if (!this.listHorariosAsignados.some((x)=>{return x.obj == listAct && x.horario == horario && x.fecha == espacios && x.profesional.idProf == this.profesionalElegido.idProfesional})) this.listHorariosAsignados.push({horario: horario, fecha: espacios, obj: listAct, profesional: {idProf: this.profesionalElegido.idProfesional, nomProf: this.profesionalElegido.nomProfesional}});
        return true;
      }
      return false;
    }
    return false;
  }
//______________________________________________________________________________________________________________________________________________________________________________________________ TERMINAR
  getDataAsignacion(horario: any, espacios: Date): any{
    let listAct = this.listHorariosAsignados.find((x)=>{return x.horario == horario && x.fecha == espacios && x.profesional.idProf == this.profesionalElegido.idProfesional});
    if (!listAct) return false;
    let longitudHoras = listAct.obj.terminaActividad.getHours() - listAct.obj.inicioActividad.getHours() + (listAct.obj.terminaActividad.getMinutes() != 0 ? 1 : 0);
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
      this.dataAsignacionSelected = asignacion;
      let actividadInfo = this.admisionCitasServicio.actividadesInfo.find((x)=>{return x.nombreActividad === asignacion.obj.actividad});
      let horaIncremental = 0;
      let fechaIncremental = this.dataAsignacionSelected.obj.inicioActividad;
      do {
        fechaIncremental = new Date(fechaIncremental.getTime() +  (1000*60*actividadInfo!.tiempo));
        horaIncremental += 1;
      } while (fechaIncremental.getTime() != this.dataAsignacionSelected.obj.terminaActividad.getTime());
      this.dataAsignacionSelected.tiempoSesion = actividadInfo?.tiempo;
      this.dataAsignacionSelected.sesiones = horaIncremental;
      return true
    }
  }

  showScheduleCalendar(dataRangoElegido: any, dataFechaElegida: any){
    if (this.profesionalElegido) {
      if (this.fechasSemana.some((x)=>{return (x.getMonth() == this.periodoCalendario.getMonth() && x.getFullYear() == this.periodoCalendario.getFullYear())})) {
        const dialogRef = this.dialog.open(DialogScheduleCalendarComponent,{
          minWidth:'400px',
          width:'60vw',
          maxWidth:'800px',
          data:{
            idHorario:          this.idHorarioProgramado,
            rangoHorario:       dataRangoElegido,
            fechaHorario:       dataFechaElegida,
            profesionalElegido: this.profesionalElegido,
            dataHorario:        this.calendarioDatos,
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
    else{
      this.notificationService.warning('Seleccione alguno de los profesionales listados');
    }
  }
}
