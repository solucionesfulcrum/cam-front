import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DetallesServicio, ProgramacionRequestRegisterServicio } from '@models/programacion/programacion-contratos/programacion-contrato-lista.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ProgramacionContratosService } from 'src/app/data/services/programacion/programacion-contratos.service';

@Component({
  selector: 'esp-dialog-add-programacion-asignacion',
  templateUrl: './dialog-add-programacion-asignacion.component.html',
  styleUrls: ['./dialog-add-programacion-asignacion.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class DialogAddProgramacionAsignacionComponent {
  status: RequestStatus = 'init';
  ctrlPersonalizado = new FormControl(false);

  listParamTipo: any[] = [];
  listaHorariosFiltrados: any[] = [];
  listCirams: any[] = [];
  listaRangosHorariosFiltrados: any[] = [];
  listaLimitesHorarios: any[] = [];
  formSchedule = this.fb.nonNullable.group({
    frmFecha:['', Validators.required],
    frmInicioHorario:['', Validators.required],
    frmFinHorario:['', Validators.required]
  });
  horarioFinElegido: any;
  
  ctrlTipo = new FormControl('');
  ctrlDireccion = new FormControl('', [Validators.required]);
  dataTipo: any;
  ctrlServicio = new FormControl('', [Validators.required]);
  ctrlCiram = new FormControl('');


  constructor(@Inject(DIALOG_DATA) public data      : any,
              private fb                            : FormBuilder,
              @Inject(LOCALE_ID) private locale     : string,
              public datepipe                       : DatePipe,
              private datosService                  : DatosGeneralesService,
              private programacionService           : ProgramacionContratosService,
              private notificacionService           : NotificationService,
              private _dialogRef                    : DialogRef<any>) {

  }


  ngOnInit(): void {
    console.log(this.data)
    this.ctrlTipo.disable();
    // this.getActividades();
    this.formSchedule.controls.frmInicioHorario.setValue(null!)
    this.setListeners();
    this.getParaametros();
    this.transformDataDates()
    this.listarHorariosDisponibles()
    this.formSchedule.controls.frmFecha.valueChanges.subscribe((data)=>{
      this.formSchedule.controls.frmInicioHorario.setValue(null!);
      this.formSchedule.controls.frmFinHorario.setValue(null!);
    })
    this.formSchedule.controls.frmInicioHorario.valueChanges.subscribe((data)=>{
      this.formSchedule.controls.frmFinHorario.setValue(null!);
    })

    if (this.data.horarioFijo) {
      this.formSchedule.controls.frmFecha.setValue(this.data.fechaHorario);
      this.formSchedule.controls.frmFecha.disable();
      this.formSchedule.controls.frmInicioHorario.setValue((new Date(`${this.data.fechaHorario.getFullYear()}-${this.data.fechaHorario.getMonth()+1}-${this.data.fechaHorario.getDate()} ${this.data.rangoHorario.split(' ')[0]}:00 ${this.data.rangoHorario.split(' ')[1]}`)).toString());
      this.formSchedule.controls.frmInicioHorario.disable();
    }
    this.ctrlServicio.valueChanges.subscribe((data: any)=>{
      if (typeof data === 'object') {
        this.ctrlTipo.setValue(this.listParamTipo.find((datos)=> datos.nombre === data.tipoServicio).idParametros);
        this.dataTipo = this.listParamTipo.find((datos)=> datos.nombre === data.tipoServicio);
      }
      else{
        this.ctrlTipo.setValue('');
        this.dataTipo = null;
      }
      this.formSchedule.controls.frmFinHorario.setValue(null!);
      this.cargarOpcionesLimitantes()
    })
    this.ctrlPersonalizado.valueChanges.subscribe((data)=>{
      if (data) {
        this.ctrlCiram.addValidators(Validators.required);
      }
      else{
        this.ctrlCiram.removeValidators(Validators.required);
      }
    })
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
    this.datosService.getListCiramsOfCam(JSON.parse(localStorage.getItem("UnidElegida")!).idUnidOperativa).subscribe((data)=>{
      if (data.code == 0) {
        this.listCirams = data.data;
      }
      else {
        this.notificacionService.warning(data.message);
      }
    })
  }

  onClose(){
    this._dialogRef.close();
  }

  onSelectedServicioSelect(event: any){
    this.ctrlServicio.setValue(event.option.value);
  }

  onSelectedCiramSelect(event: any){
    this.ctrlCiram.setValue(event.option.value);
  }

  getOptionsFilteresServicio(): any{
    let list = this.data.serviciosContrato.servicios;
    return (list.filter((x: any)=> x.nombreServicio.toLowerCase().includes((typeof this.ctrlServicio.value) === 'string' ? this.ctrlServicio.value!.toLowerCase() : (this.ctrlServicio.value! as any).nombreServicio.toLowerCase())));
  }
  
  getOptionsFilteresCiram(): any{
    let list = this.listCirams;
    return (list.filter((x: any)=> x.nombre.toLowerCase().includes((typeof this.ctrlCiram.value) === 'string' ? this.ctrlCiram.value!.toLowerCase() : (this.ctrlCiram.value! as any).nombre.toLowerCase())));
  }

  displayServicioFiltered(selectedoption: any) {
    return selectedoption ? selectedoption.nombreServicio : undefined;
  }

  displayCiramFiltered(selectedoption: any) {
    return selectedoption ? selectedoption.nombre : undefined;
  }

  setListeners(){
    this.formSchedule.controls.frmFecha.valueChanges.subscribe((data)=>{
      this.listarHorariosDisponibles()
    })

    this.formSchedule.controls.frmInicioHorario.valueChanges.subscribe((data)=>{
      this.cargarOpcionesLimitantes()
    })

    this.formSchedule.controls.frmFinHorario.valueChanges.subscribe((data)=>{
      this.horarioFinElegido = this.listaLimitesHorarios.find((x)=> {return x.horaFin == data});
    })
  }
  // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  isNotObject(val: any): boolean{
    return typeof val !== 'object';
  }

  asAny(val: any): any{
    return (val as any);
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
    if (this.dataTipo && this.formSchedule.controls.frmInicioHorario.value) {
      let horaInicio = new Date(this.formSchedule.controls.frmInicioHorario.value)
      let count = 1;
      let horaAumentada;
      do {
        if (this.comprobarCantidadSesiones((this.ctrlServicio.value as any).idServicio) + count > 3) {
          break;
        }
        horaAumentada = new Date (horaInicio.getTime() + (1000*60*this.dataTipo.valor1)*(count))
        if (horaAumentada.getHours() > 20 || (horaAumentada.getHours() == 20 && horaAumentada.getMinutes() != 0)) {
          break;
        }
        this.listaLimitesHorarios.push({horaFin: horaAumentada, deshabilitado: false, cantidadCupos: count})
        count += 1;
      } while (horaAumentada.getHours() < 20);
    }
  }

  transformDataDates(){
    let primerLimite = new Date(this.data.dataContrato.fechInicio.replace(/-/g, '\/'));
    let segundoLimite = new Date(this.data.dataContrato.fechFin.replace(/-/g, '\/'));
    this.data.semanaElegida.forEach((x: Date) => {
      if ((x.getDay() != 0 && x.getDay() != 6) && (x.getTime() >= primerLimite.getTime() && x.getTime() <= segundoLimite.getTime())) {
        this.listaHorariosFiltrados.push({diaFecha: x, deshabilitado: false});
      }
    });
  }

  comprobarCantidadSesiones(idServicio: any): number{
    let asignacionesSemana: any[] = [];
    let numeroSesiones: number = 0;
    this.data.semanaElegida.forEach((x: any) => {
      this.data.infoServiciosContratados.filter((y: any) => y.fecha == formatDate(x, 'yyyy-MM-dd', this.locale)).forEach((z: any)=> {if(z.idServicio == idServicio){asignacionesSemana.push(z)}})
    });
    asignacionesSemana.forEach((x)=>{
      numeroSesiones = numeroSesiones + x.nroSesiones;
    })
    return numeroSesiones;
  }

  onSave(){
    if (this.ctrlPersonalizado.value && (typeof this.ctrlCiram.value !== 'object')) {
      this.ctrlCiram.markAllAsTouched()
    }
    else if (this.formSchedule.valid && this.dataTipo && this.ctrlDireccion.valid) {
      this.status = 'loading';
      this.programacionService.registerAsignacionesDia(this.getPayloadRegistro()).subscribe((data)=>{
        if (data.code == 0) {
          this.status = 'success';
          this.listParamTipo = data.data;
          this.notificacionService.success('Se registró la asignación satisfactoriamente');
          this._dialogRef.close(1);
        }
        else {
          this.status = 'failed';
          this.notificacionService.warning(data.message);
        }
      })
    }
    else {
      this.formSchedule.markAllAsTouched();
      this.ctrlServicio.markAllAsTouched();
      this.ctrlDireccion.markAllAsTouched()
    }
  }

  getPayloadRegistro(): ProgramacionRequestRegisterServicio{
    return {
      idProgramacion: this.data.dataContrato.idProgramacion,
      fecha: formatDate(this.formSchedule.controls.frmFecha.value, 'yyyy-MM-dd', this.locale),
      detalles: this.payloadServicio()
    }
  }

  payloadServicio(): DetallesServicio[]{
    let listServicios: DetallesServicio[] = [];
    let listServiciosPrevios = this.data.infoServiciosContratados.filter((x: any)=>{ return x.fecha == formatDate(this.formSchedule.controls.frmFecha.value, 'yyyy-MM-dd', this.locale)});
    if (listServiciosPrevios.length > 0) {
      listServiciosPrevios.forEach((x: any) => {
        listServicios.push({
          idServicio: x.idServicio,
          horaInicio: x.horaInicio,
          horaFin: x.horaFin,
          nroSesiones: x.nroSesiones,
          duracion: x.duracion,
          paramServicioTipoId: x.paramServicioTipoId,
          idUoCiram: x.idUoCiram,
          ubicacion: x.ubicacion
        })
      });
    }
    listServicios.push({
      idServicio: (this.ctrlServicio.value! as any).idServicio,
      horaInicio: formatDate(this.formSchedule.controls.frmInicioHorario.value, 'HH:mm', this.locale),
      horaFin: formatDate(this.formSchedule.controls.frmFinHorario.value, 'HH:mm', this.locale),
      nroSesiones: this.horarioFinElegido.cantidadCupos,
      duracion: (this.dataTipo.valor1 ? this.dataTipo.valor1 : 60),
      paramServicioTipoId: this.dataTipo.idParametros,
      idUoCiram: (this.ctrlPersonalizado.value ? (this.ctrlCiram.value! as any).idUnidadOperativa : null),
      ubicacion: this.ctrlDireccion.value!
    })

    return listServicios;
  }
}
