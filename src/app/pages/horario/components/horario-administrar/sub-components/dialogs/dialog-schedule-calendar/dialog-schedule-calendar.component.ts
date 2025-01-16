import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestRegisterAtencion, StoreAsignacionProfesional } from '@models/horario/horario.model';
import { AdmisionCitasService } from '@services/admision/admision-citas.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { HorarioAdministracionService } from '@services/horario/horario-administracion.service';
import { NotificationService } from '@services/notification.service';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'esp-dialog-schedule-calendar',
  templateUrl: './dialog-schedule-calendar.component.html',
  styleUrls: ['./dialog-schedule-calendar.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class DialogScheduleCalendarComponent {
  
  ctrlPersonalizado = new FormControl(false);
  ctrlActividad = new FormControl();
  listActividades: any[] = [];
  actividadSeleccionadoTmp!: any;
  filteredOptionsActividad!: Observable<any[]>;
  
  listaHorariosFiltrados: any[] = [];
  listaRangosHorariosFiltrados: any[] = [];
  listaLimitesHorarios: any[] = [];

  formSchedule = this.fb.nonNullable.group({
    frmFecha:['', Validators.required],
    frmInicioHorario:['', Validators.required],
    frmFinHorario:['', Validators.required]
  });
  horarioFinElegido: any;

  formSemanaDias = this.fb.nonNullable.group({
    0: this.fb.array([]),
    1: this.fb.array([]),
    2: this.fb.array([]),
    3: this.fb.array([]),
    4: this.fb.array([]),
    5: this.fb.array([]),
    6: this.fb.array([])
  })

  constructor(@Inject(DIALOG_DATA) public data      : any,
              private fb                            : FormBuilder,
              private dialog                        : Dialog,
              public datepipe                       : DatePipe,
              private notificacionService           : NotificationService,
              private datosGeneralesService         : DatosGeneralesService,
              private horarioService                : HorarioAdministracionService,
              private citasService                  : AdmisionCitasService,
              private _dialogRef                    : DialogRef<DialogScheduleCalendarComponent>) {

  }


  ngOnInit(): void {
    //console.log(this.data)
    //console.log(this.horarioService.horarioRegistrado.listProfesionales.find((x)=>{return x.idProfesional == this.data.profesionalElegido.profesionalId}))
    this.getActividades();
    this.formSchedule.controls.frmInicioHorario.setValue(null!)
    this.setListeners();
    this.transformDataDates()
    this.listarHorariosDisponibles()

    if (this.data.horarioFijo) {
      this.formSchedule.controls.frmFecha.setValue(this.data.fechaHorario);
      this.formSchedule.controls.frmFecha.disable();
      this.formSchedule.controls.frmInicioHorario.setValue((new Date(`${this.data.fechaHorario.getFullYear()}-${this.data.fechaHorario.getMonth()+1}-${this.data.fechaHorario.getDate()} ${this.data.rangoHorario.split(' ')[0]}:00 ${this.data.rangoHorario.split(' ')[1]}`)).toString());
      this.formSchedule.controls.frmInicioHorario.disable();
    }
  }

  setListeners(){
    this.filteredOptionsActividad = this.ctrlActividad.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.actividad),
      map(actividad => actividad ? this._filter(actividad) : this.listActividades.slice())
    );

    this.formSchedule.controls.frmFecha.valueChanges.subscribe((data)=>{
      this.listarHorariosDisponibles()
    })

    this.formSchedule.controls.frmInicioHorario.valueChanges.subscribe((data)=>{
      this.cargarOpcionesLimitantes()
    })

    this.formSchedule.controls.frmFinHorario.valueChanges.subscribe((data)=>{
      this.horarioFinElegido = this.listaLimitesHorarios.find((x)=> {return x.horaFin == data});
    })

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

  // Select Actividad--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  async getActividades(){
    await this.datosGeneralesService.getListaActividades().subscribe((data)=>{
      if (data.code == 0) {
        data.data.forEach((element: any) => {
          this.listActividades.push(element[0]);
        });
        this.listActividades.sort((a, b)=> a.actividad.localeCompare(b.actividad))
        this.ctrlActividad.setValue('');
        //console.log(this.listActividades)
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })
  }
  private _filter(value: string): any[] {
    if (value != undefined) {
      return this.listActividades.filter(actividad => actividad.actividad.toLowerCase().includes(value.toLowerCase()));
    }
    return this.listActividades;
  }
  displayFnActividad(selectedoption: any) {
    return selectedoption ? selectedoption.actividad : undefined;
  }
  onSelectionChangeActividad(event: any) {
    this.actividadSeleccionadoTmp = event.option.value;
    this.cargarOpcionesLimitantes()
  }
  // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  transformDataDates(){
    this.data.semanaElegida.forEach((x: Date) => {
      if (x.getMonth() == this.data.dataHorario.mesId-1 && (x.getDay() != 0  && x.getDay() != 6 || this.data.profesionalElegido.rangoDias === 'L-S' && x.getDay() == 6)) {
        this.listaHorariosFiltrados.push({diaFecha: x, deshabilitado: false});
      }
    });
  }

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
    if (this.actividadSeleccionadoTmp && this.formSchedule.controls.frmInicioHorario.value) {
      let horaInicio = new Date(this.formSchedule.controls.frmInicioHorario.value)
      let count = 1;
      let horaAumentada;

      do {
        horaAumentada = new Date (horaInicio.getTime() + (1000*60*this.actividadSeleccionadoTmp.duracion)*(count))
        if (horaAumentada.getHours() > 20 || (horaAumentada.getHours() == 20 && horaAumentada.getMinutes() != 0)) {
          break;
        }
        this.listaLimitesHorarios.push({horaFin: horaAumentada, deshabilitado: false, cantidadCupos: count})
        count += 1;
      } while (horaAumentada.getHours() < 20);

      //console.log(this.listaLimitesHorarios)
    }
  }

  onClose(){
    this._dialogRef.close();
  }

  onSave(){
    //console.log(this.getFormAsignacion());
    this.horarioService.horarioRegistrado.listProfesionales.find((x)=>{return x.idProfesional == this.data.profesionalElegido.profesionalId}).asignaciones.push(this.getFormAsignacion());
    this._dialogRef.close();
  }

  getFormData(): RequestRegisterAtencion{
    return {
      idHorario: this.data.idHorario,
      idProfesional: this.data.profesionalElegido.profesionalId,
      horaInicioAsignacion: new Date(this.formSchedule.controls.frmInicioHorario.value),
      horaFinAsignacion: new Date(this.formSchedule.controls.frmFinHorario.value!),
      actividadRegistrada: this.actividadSeleccionadoTmp.nombreActividad
    }
  }

  getFormAsignacion(): StoreAsignacionProfesional{
    return {
      horarioPlanificacionId: 0,
      actividadId: this.actividadSeleccionadoTmp.actividadId,
      actividadNombre: this.actividadSeleccionadoTmp.actividad,
      fecha: this.datepipe.transform(new Date(this.formSchedule.controls.frmInicioHorario.value), 'yyyy-MM-dd')!,
      horaInicio: this.datepipe.transform(new Date(this.formSchedule.controls.frmInicioHorario.value), 'HH:mm')!,
      horaFin: this.datepipe.transform(new Date(this.formSchedule.controls.frmFinHorario.value), 'HH:mm')!,
      numeroCupos: this.horarioFinElegido.cantidadCupos,
      duracionActividad: this.actividadSeleccionadoTmp.duracion
    };
  }

  // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------Funciones de control de datos
  getFormGroup(control: AbstractControl) { return control as FormGroup; }

  addControlToDate(value: Date){
    let filaForm = this.fb.group({
      fechaAgendacion: new FormControl((value)),
      horaInicio: new FormControl(),
      horaFin: new FormControl(),
      cantCupos: new FormControl()
    })
    
    filaForm.valueChanges.subscribe((fila: any)=>{
      if (fila.horaInicio) {
        fila.horaInicio = new Date((new Date(fila.fechaAgendacion)).setHours((new Date(fila.horaInicio)).getHours()))
      }
      if (fila.cantCupos < 1) filaForm.controls.cantCupos.setValue(null, { emitEvent: false });
      if (fila.cantCupos == null) filaForm.controls.horaFin.setValue(null, { emitEvent: false });

      if (fila.horaInicio && fila.cantCupos && this.actividadSeleccionadoTmp) {
        let diaFinal = new Date(fila.horaInicio.getTime() + (1000*60*this.actividadSeleccionadoTmp.tiempo)*(fila.cantCupos));
        if (diaFinal.getHours() > 20 || (diaFinal.getHours() == 20  && diaFinal.getMinutes() != 0)|| diaFinal.getDate() != fila.horaInicio.getDate()) {
          this.notificacionService.warning('La cantidad de turnos excede al limite')
          filaForm.controls.cantCupos.setValue(1);
        }
        else{
          filaForm.controls.horaFin.setValue(diaFinal, { emitEvent: false });
        }
      }
    })
    this.getControlDia(value.getDay()).push(filaForm);
  }

  getControlDia(value: any) {
    return this.formSemanaDias.controls[value as keyof typeof this.formSemanaDias.controls] as FormArray;
  }

  deleteElement(dateIndex: number, elementIndex: number) {
    this.getControlDia(dateIndex).removeAt(elementIndex);
  }
  // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
}
