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
  dataTipo: any;
  ctrlServicio = new FormControl('');
  ctrlCiram = new FormControl('');


  constructor(@Inject(DIALOG_DATA) public data      : any,
              private fb                            : FormBuilder,
              public datepipe                       : DatePipe,
              private datosService                  : DatosGeneralesService,
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
      this.cargarOpcionesLimitantes()
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

    this.formSchedule.controls.frmFinHorario.valueChanges.subscribe((data)=>{
      this.horarioFinElegido = this.listaLimitesHorarios.find((x)=> {return x.horaFin == data});
      console.log(this.horarioFinElegido)
    })

    // this.ctrlPersonalizado.valueChanges.subscribe((data)=>{
    //   if (data){
    //     this.formSchedule.controls.frmFecha.disable({ emitEvent: false });
    //     this.formSchedule.controls.frmInicioHorario.disable({ emitEvent: false });
    //     this.formSchedule.controls.frmFinHorario.disable({ emitEvent: false });
    //   }
    //   else{
    //     if (!this.data.horarioFijo) {
    //       this.formSchedule.controls.frmFecha.enable({ emitEvent: false });
    //       this.formSchedule.controls.frmInicioHorario.enable({ emitEvent: false });
    //     }
    //     this.formSchedule.controls.frmFinHorario.enable({ emitEvent: false });
    //   }
    // })
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
    if (this.dataTipo && this.formSchedule.controls.frmInicioHorario.value) {
      let horaInicio = new Date(this.formSchedule.controls.frmInicioHorario.value)
      let count = 1;
      let horaAumentada;

      do {
        if (count > 3) {
          console.log(this.listaLimitesHorarios)
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


  onSave(){
    // this._dialogRef.close();
  }

}
