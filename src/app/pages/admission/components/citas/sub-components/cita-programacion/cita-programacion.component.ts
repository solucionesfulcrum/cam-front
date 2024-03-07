import { Dialog } from '@angular/cdk/dialog';
import { Component, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { AdmisionCitasService } from '@services/admision/admision-citas.service';
import { DialogRecordatorioComponent } from './dialog-recordatorio/dialog-recordatorio.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'esp-cita-programacion',
  templateUrl: './cita-programacion.component.html',
  styleUrls: ['./cita-programacion.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class CitaProgramacionComponent {

  fechaActual = new Date();
  cantidadCitasCuadro = 0;

  fechasSemana: Date[] = [];
  ctrlActividad = new FormControl();
  ctrlProfesional = new FormControl();
  ctrlHorarios = new FormControl();

  optElegida: any;

  opcionesActividades: any[] = [];

  opcionesTurnos: any[] = [];

  profesionalesDisponibles: any[] = [];

  horarios = ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM']

  constructor(private fb                : FormBuilder,
              private dialog            : Dialog,
              private activeRoute       : ActivatedRoute,
              private citasService      : AdmisionCitasService,) {
  }

  ngOnInit(){
    this.ctrlHorarios.setValue('Semana');
    this.opcionesActividades = this.citasService.getActividadesProgramar();
    
    this.getFechasSemana(new Date(new Date(new Date().setHours(0,0)).setSeconds(0,0)));

    this.ctrlProfesional.valueChanges.subscribe((profesionalElegido)=>{
      this.profesionalesDisponibles = [];
      if (profesionalElegido == 0) {
        this.profesionalesDisponibles = this.opcionesTurnos.filter((x)=>{return x.idProfesional != 0})
      }
      else{
        this.profesionalesDisponibles.push(this.opcionesTurnos.find((x)=>{return x.idProfesional == profesionalElegido}));
      }
      // console.log(this.profesionalesDisponibles)
    })

    this.ctrlActividad.valueChanges.subscribe((data)=>{
      // this.ctrlProfesional.enable();
      // console.log(data)
      this.optElegida = this.opcionesActividades.find((x)=>{ return x.id == data })
      // console.log(this.optElegida)
      if (this.optElegida.tipoTiempo === 'Hora') this.cantidadCitasCuadro = 1;
      else{
        this.cantidadCitasCuadro = Math.floor(60 / this.optElegida.tiempo);
      }
      this.opcionesTurnos = [];
      this.opcionesTurnos.splice(0,0,{idProfesional: 0, nombreProfesional: 'Todos los Profesionales', cargo: null})
      for (let i = 0; i < this.optElegida.profesionalesAsignados.length; i++) {
        this.opcionesTurnos.push(this.optElegida.profesionalesAsignados[i])
        
      }
      this.ctrlProfesional.setValue(0);
    })
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
    let mesInicio = fechaEvaluar.getMonth();
    let cambioMesMayor = false;
    let cambioMesMenor = false;
    let cambioMesMenorSub = false;
    let fechaInicio = new Date(fechaEvaluar);
    let contador = 2;
    let contadorMenor = 2;
    for (let i = 0; i < 7; i++) {
      let date: Date;
      if (cambioMesMayor) {
        date = new Date(fechaInicio.setDate(contador))
        contador += 1;
      }
      else if(cambioMesMenor){
        if (cambioMesMenorSub) {
          date = new Date(fechaInicio.setDate(contadorMenor))
          contadorMenor += 1;
        }
        else{
          let temp = fechaInicio.getMonth();
          date = new Date(fechaInicio.setDate(fechaInicio.getDate()+1));
          if (date.getMonth() > temp) cambioMesMenorSub = true;
        }
      }
      else{
        date = new Date(fechaInicio.setDate(fechaEvaluar.getDate() - fechaEvaluar.getDay() + i))
        if (date.getMonth() > mesInicio) cambioMesMayor = true;
        if (date.getMonth() < mesInicio) cambioMesMenor = true;
      } 
      this.fechasSemana.push(date);  
    }
    // console.log(this.fechasSemana);  
  }

  getCitaAsignado(fecha: Date, horario: any, idProfesional: number): number{

    let horaElegida = (horario.split(' ')[1] == 'PM' && horario.split(' ')[0] !== '12') ? parseInt(horario.split(' ')[0]) + 12 : parseInt(horario.split(' ')[0]);
    let horaUsarInicio = new Date(fecha.getTime() + 1000*60*60* horaElegida);

    // console.log(horaUsarInicio)
    return this.citasService.getConsultaAsignacionesPersona(horaUsarInicio, idProfesional, this.optElegida.id);
  }

  openGenerateCita(horario: any, fecha: Date, profesional: any){
    const dialogRef = this.dialog.open(DialogRecordatorioComponent,{
      minWidth:'600px',
      width: '90vw',
      maxWidth:'50%',
      data:{
        horario: horario,
        fecha: fecha,
        actividad: this.optElegida,
        cantCitas: this.cantidadCitasCuadro,
        tieneAsignacion: this.getCitaAsignado(fecha, horario, profesional.idProfesional),
        profesional: profesional,
        numHist: this.activeRoute.snapshot.paramMap.get('numHist'),
        citaId: this.activeRoute.snapshot.paramMap.get('id')
      }
    })
  }
}
