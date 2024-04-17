import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '@services/notification.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'esp-dialog-add-programacion-asignacion',
  templateUrl: './dialog-add-programacion-asignacion.component.html',
  styleUrls: ['./dialog-add-programacion-asignacion.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class DialogAddProgramacionAsignacionComponent {
  ctrlPersonalizado = new FormControl(false);

  listParamTipo: any[] = [];
  listaHorariosFiltrados: any[] = [];
  listaRangosHorariosFiltrados: any[] = [];
  listaLimitesHorarios: any[] = [];
  formSchedule = this.fb.nonNullable.group({
    frmFecha:['', Validators.required],
    frmInicioHorario:['', Validators.required],
    frmFinHorario:['', Validators.required]
  });


  constructor(@Inject(DIALOG_DATA) public data      : any,
              private fb                            : FormBuilder,
              public datepipe                       : DatePipe,
              private datosService                  : DatosGeneralesService,
              private notificacionService           : NotificationService,
              private _dialogRef                    : DialogRef<any>) {

  }


  ngOnInit(): void {
    console.log(this.data)
    // this.getActividades();
    this.formSchedule.controls.frmInicioHorario.setValue(null!)
    this.setListeners();
    this.getParaametros();
    this.transformDataDates()
    this.listarHorariosDisponibles()

    if (this.data.horarioFijo) {
      this.formSchedule.controls.frmFecha.setValue(this.data.fechaHorario);
      this.formSchedule.controls.frmFecha.disable();
      this.formSchedule.controls.frmInicioHorario.setValue((new Date(`${this.data.fechaHorario.getFullYear()}-${this.data.fechaHorario.getMonth()+1}-${this.data.fechaHorario.getDate()} ${this.data.rangoHorario.split(' ')[0]}:00 ${this.data.rangoHorario.split(' ')[1]}`)).toString());
      console.log(this.formSchedule.controls.frmInicioHorario.value)
      this.formSchedule.controls.frmInicioHorario.disable();
    }
  }

  getParaametros(){
    this.datosService.getTipoParametros('TIPO_SERVICIO').subscribe((data)=>{
      if (data.code == 0) {
        this.listParamTipo = data.data;
      }
      else {
        this.notificacionService.warning(data.message);
      }
    })
  }

  onClose(){
    this._dialogRef.close();
  }

  setListeners(){
    // this.filteredOptionsActividad = this.ctrlActividad.valueChanges.pipe(
    //   startWith(''),
    //   map(value => typeof value === 'string' ? value : value.actividad),
    //   map(actividad => actividad ? this._filter(actividad) : this.listActividades.slice())
    // );

    this.formSchedule.controls.frmFecha.valueChanges.subscribe((data)=>{
      this.listarHorariosDisponibles()
    })

    this.formSchedule.controls.frmInicioHorario.valueChanges.subscribe((data)=>{
      this.cargarOpcionesLimitantes()
    })

    // this.formSchedule.controls.frmFinHorario.valueChanges.subscribe((data)=>{
    //   this.horarioFinElegido = this.listaLimitesHorarios.find((x)=> {return x.horaFin == data});
    // })

    this.ctrlPersonalizado.valueChanges.subscribe((data)=>{
      if (data){
        this.formSchedule.controls.frmFecha.disable({ emitEvent: false });
        this.formSchedule.controls.frmInicioHorario.disable({ emitEvent: false });
        this.formSchedule.controls.frmFinHorario.disable({ emitEvent: false });
      }
      else{
        if (!this.data.horarioFijo) {
          this.formSchedule.controls.frmFecha.enable({ emitEvent: false });
          this.formSchedule.controls.frmInicioHorario.enable({ emitEvent: false });
        }
        this.formSchedule.controls.frmFinHorario.enable({ emitEvent: false });
      }
    })
  }
  // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  listarHorariosDisponibles(){
    this.listaRangosHorariosFiltrados = [];
    if (this.formSchedule.controls.frmFecha.value != '') {
      let fechaProgramada = new Date(this.formSchedule.controls.frmFecha.value);
      this.data.dataRangosHorarios.forEach((x: any) => {
        this.listaRangosHorariosFiltrados.push({horaSeleccionable: new Date(`${fechaProgramada.getFullYear()}-${fechaProgramada.getMonth()+1}-${fechaProgramada.getDate()} ${x.split(' ')[0]}:00 ${x.split(' ')[1]}`), deshabilitado: false})
      });
      if (!this.data.horarioFijo) {
        this.formSchedule.controls.frmInicioHorario.setValue(null!);
      }
    }
  }
  

  cargarOpcionesLimitantes(){
    this.listaLimitesHorarios = [];
    if (/*this.actividadSeleccionadoTmp && */this.formSchedule.controls.frmInicioHorario.value) {
      let horaInicio = new Date(this.formSchedule.controls.frmInicioHorario.value)
      let count = 1;
      let horaAumentada;

      do {
        horaAumentada = new Date (horaInicio.getTime() + (1000*60*45)*(count))
        if (horaAumentada.getHours() > 20 || (horaAumentada.getHours() == 20 && horaAumentada.getMinutes() != 0)) {
          break;
        }
        this.listaLimitesHorarios.push({horaFin: horaAumentada, deshabilitado: false, cantidadCupos: count})
        count += 1;
      } while (horaAumentada.getHours() < 20);

      console.log(this.listaLimitesHorarios)
    }
  }

  transformDataDates(){
    let primerLimite = new Date(this.data.dataContrato.datosContrato.fechInicio.replace(/-/g, '\/'));
    let segundoLimite = new Date(this.data.dataContrato.datosContrato.fechFin.replace(/-/g, '\/'));
    this.data.semanaElegida.forEach((x: Date) => {
      if ((x.getDay() != 0 && x.getDay() != 6) && (x.getTime() >= primerLimite.getTime() && x.getTime() <= segundoLimite.getTime())) {
        this.listaHorariosFiltrados.push({diaFecha: x, deshabilitado: false});
      }
    });
    console.log(this.listaHorariosFiltrados)
  }


  onSave(){
    this._dialogRef.close();
  }

}
