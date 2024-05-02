import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DetallesServicio, ProgramacionRequestRegisterServicio, Servicio, ServiciosOrdenados } from '@models/programacion/programacion-contratos/programacion-contrato-lista.model';
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

  listServicios: ServiciosOrdenados[] = [];
  listFiltered: ServiciosOrdenados[] = [];
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
    this.ctrlTipo.disable(); console.log(this.data)
    // this.getActividades();
    this.formSchedule.controls.frmInicioHorario.setValue(null!)
    this.setListeners();
    this.getParaametros();
    this.transformDataDates()
    this.listarHorariosDisponibles()
    // Creación Lista de Servicios con Ciram --------------------------------------------------------------
    this.ordenamientoServicios();
    // ----------------------------------------------------------------------------------------------------
    if (this.data.horarioFijo) {
      this.formSchedule.controls.frmFecha.setValue(this.data.fechaHorario);
      this.formSchedule.controls.frmFecha.disable();
      let listServiciosPrevios = this.data.infoServiciosContratados.filter((x: any)=>{ return x.fecha == formatDate(this.formSchedule.controls.frmFecha.value, 'yyyy-MM-dd', this.locale)});
      let fechaEstablecido = new Date(`${formatDate(this.formSchedule.controls.frmFecha.value, 'yyyy-MM-dd', this.locale)} ${this.data.rangoHorario.split(' ')[0]}:00 ${this.data.rangoHorario.split(' ')[1]}`);
      if (listServiciosPrevios.length) {
        listServiciosPrevios.forEach((x: any)=> {
          let primeraFecha = new Date(`${x.fecha} ${x.horaInicio}`);
          let limiteFecha = new Date(`${x.fecha} ${x.horaFin}`);
          if (primeraFecha.getTime() <= (fechaEstablecido).getTime() && limiteFecha.getTime() > (fechaEstablecido).getTime()) {
            fechaEstablecido.setMinutes(limiteFecha.getMinutes());
          }
        })
      }
      this.formSchedule.controls.frmInicioHorario.setValue(fechaEstablecido.toString());
      this.formSchedule.controls.frmInicioHorario.disable();
    }
  }
  // Creación Lista de Servicios con Ciram --------------------------------------------------------------
  ordenamientoServicios(){
    let listServ: Servicio[] = [];
    this.data.serviciosContrato.servicios.forEach((x: any)=> {
      listServ.push({
        idServicio: x.idServicio,
        nombreServicio: x.nombreServicio,
        tipoServicio: x.tipoServicio,
        idUnid: this.data.serviciosContrato.idUnidOpeCam,
        nomUnid: this.data.serviciosContrato.cam
      })
    })
    let dataAsigServ: ServiciosOrdenados = {
      idUnid: this.data.serviciosContrato.idUnidOpeCam,
      nomUnid: this.data.serviciosContrato.cam,
      servicios: listServ
    };
    this.listServicios.push(dataAsigServ);

    this.data.serviciosCiram.forEach((x: any)=>{
      let serviciosX: Servicio[] = [];
      x.servicios.forEach((y: any) => {
        serviciosX.push({
          idServicio: y.idServicio,
          nombreServicio: y.nombreServicio,
          tipoServicio: y.tipoServicio,
          idUnid: x.idUnidOpeCiram,
          nomUnid: x.ciram          
        })
      });
      this.listServicios.push({
        idUnid: x.idUnidOpeCiram,
        nomUnid: x.ciram,
        servicios: serviciosX
      })
    })
    this.listFiltered = this.listServicios;
  }
  // ----------------------------------------------------------------------------------------------------

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
    let list: ServiciosOrdenados[] = [];
    this.listServicios.forEach((x)=>{
      let servers = x.servicios.filter((y)=> y.nombreServicio.toLowerCase().includes((typeof this.ctrlServicio.value) === 'string' ? this.ctrlServicio.value!.toLowerCase() : (this.ctrlServicio.value! as any).nombreServicio.toLowerCase()));
      if (servers.length > 0) {
        list.push({
          idUnid: x.idUnid,
          nomUnid: x.nomUnid,
          servicios: servers
        })
      }
    });
    return list;
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
    this.formSchedule.controls.frmFecha.valueChanges.subscribe((data)=>{
      this.formSchedule.controls.frmInicioHorario.setValue(null!);
      this.formSchedule.controls.frmFinHorario.setValue(null!);
    })
    this.formSchedule.controls.frmInicioHorario.valueChanges.subscribe((data)=>{
      this.formSchedule.controls.frmFinHorario.setValue(null!);
    })
    this.ctrlServicio.valueChanges.subscribe((data: any)=>{
      this.listFiltered = this.getOptionsFilteresServicio();
      if (typeof data === 'object') {
        this.ctrlTipo.setValue(this.listParamTipo.find((datos)=> datos.nombre === data.tipoServicio).idParametros);
        this.dataTipo = this.listParamTipo.find((datos)=> datos.nombre === data.tipoServicio);
        this.comprobarLimiteSesiones(data.idServicio)
      }
      else{
        this.ctrlTipo.setValue('');
        this.dataTipo = null;
      }
      this.formSchedule.controls.frmFinHorario.setValue(null!);
      this.cargarOpcionesLimitantes()
    })
    this.ctrlPersonalizado.valueChanges.subscribe((data)=>{
      this.cargarOpcionesLimitantes()
      if (data) {
        this.ctrlCiram.addValidators(Validators.required);
      }
      else{
        this.ctrlCiram.removeValidators(Validators.required);
      }
    })
    this.ctrlCiram.valueChanges.subscribe((data)=>{
      this.cargarOpcionesLimitantes()
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
        let minutos = 0;
        for (let i = 0; i < 4; i++) {
          this.listaRangosHorariosFiltrados.push({horaSeleccionable: new Date(`${fechaProgramada.getFullYear()}-${fechaProgramada.getMonth()+1}-${fechaProgramada.getDate()} ${x.split(' ')[0]}:${minutos} ${x.split(' ')[1]}`), deshabilitado: false});
          minutos+=15;
        }
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
        if ((this.comprobarCantidadSesiones((this.ctrlServicio.value as any).idServicio) + count > 3) || this.comprobarSimilaridadSemana((this.ctrlServicio.value as any).idServicio).validacion || this.comprobarLimiteSesiones((this.ctrlServicio.value as any).idServicio) >= (this.data.dataContrato.nroEntregables*12) || this.comprobarAsignacionesEntregables((this.ctrlServicio.value as any).idServicio) || this.comprobarAsignacionesUnidadOper((this.ctrlServicio.value as any).idServicio).validacion) {
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

  // COMPROBACIONES -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  comprobarSimilaridadSemana(idServicio: any): any{
    let servEncontrado: any;
    this.data.semanaElegida.forEach((x: Date)=> {
      if (!servEncontrado) {
        this.data.infoServiciosContratados.filter((y: any)=> y.idServicio == idServicio && y.fecha == formatDate(x, 'yyyy-MM-dd', this.locale)).forEach((elem: any)=>{
          servEncontrado = elem;
        })
      }
    })
    if (!servEncontrado) {
      servEncontrado = Object();
      servEncontrado.validacion = false;
    }
    else{
      if (servEncontrado.idUoCiram) {
        if (this.ctrlPersonalizado.value) {
          if (typeof this.ctrlCiram.value == 'object') {
            if ((this.ctrlCiram.value as any).idUnidadOperativa == servEncontrado.idUoCiram) {
              servEncontrado.validacion = false;
            }
            else{
              servEncontrado.validacion = true;
              servEncontrado.message = `El servicio pertenece al CIRAM ${this.data.serviciosCiram.find((z: any)=> z.idUnidOpeCiram == servEncontrado.idUoCiram).ciram}`;              
            }
          }
          else {
            servEncontrado.validacion = true;
            servEncontrado.message = 'Seleccione un CIRAM para validar su asignación';
          }
        }
        else{
          servEncontrado.validacion = true;
          servEncontrado.message = 'Este servicio esta asignado a un CIRAM, elija uno para realizar la comprobación';
        }
      }
      else{
        if (this.ctrlPersonalizado.value) {
          servEncontrado.validacion = true;
          servEncontrado.message = 'Desactive la función de programación a CIRAM';
        }
        else{
          servEncontrado.validacion = false;
        }
      }
    }
    return servEncontrado;
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

  comprobarAsignacionesEntregables(idServicio: any): boolean{
    let dataSemanaPasada: Date[] = [];
    let fechaEvaluar: Date;
    if (this.data.horarioFijo) {
      fechaEvaluar = this.data.fechaHorario;
    }
    else{
      fechaEvaluar = this.data.semanaElegida[0];
    }
    let diaInicio = new Date(fechaEvaluar.getTime() - 1000*60*60*24*fechaEvaluar.getDay() - 1000*60*60*24*7);
    for (let i = 0; i < 7; i++) {
      dataSemanaPasada.push(diaInicio);
      diaInicio = new Date(diaInicio.getTime() + 1000*60*60*24);
    }
    dataSemanaPasada.forEach((x)=> { console.log(this.data.infoServiciosContratados.filter((y: any) => y.fecha == formatDate(x, 'yyyy-MM-dd', this.locale) && y.idServicio == idServicio)) })
    // console.log(dataSemanaPasada)
    // console.log(idServicio)
    return false;
  }

  comprobarAsignacionesUnidadOper(idServicio: any): any{
    let objRespuesta: any = Object();
    let sesionesServ: number = 0;
    let listSersionesAsig = this.data.infoServiciosContratados.filter((x: any)=> {
      return x.idServicio == idServicio/* && ((this.ctrlPersonalizado.value && typeof this.ctrlCiram.value == 'object') ? (this.ctrlCiram.value as any).idUnidadOperativa == x.idUoCiram : true)*/;
    })
    listSersionesAsig.forEach((element: any) => {
      sesionesServ += element.nroSesiones;
    });
    if (sesionesServ == 0) {
      objRespuesta.validacion = false;
    }
    else {
      if (sesionesServ % 12 == 0) {
        objRespuesta.validacion = false;
      }
    }
    console.log(listSersionesAsig)
    console.log(0/4, 1/4, 2/4, 3/4, 4/4)
    console.log(0%4, 1%4, 2%4, 3%4, 4%4)
    return objRespuesta;
  }

  comprobarLimiteSesiones(idServicio: any): number{
    let sesionesTotales: number = 0;
    this.data.infoServiciosContratados.forEach((x: any)=> {if (x.idServicio == idServicio) { sesionesTotales += x.nroSesiones }})
    return sesionesTotales;
  }

  validateAsignacionFecha(): boolean{
    let listServiciosPrevios = this.data.infoServiciosContratados.filter((x: any)=>{ return x.fecha == formatDate(this.formSchedule.controls.frmFecha.value, 'yyyy-MM-dd', this.locale)});
    let error: boolean = false;
    let HorarioInicio = new Date(this.formSchedule.controls.frmInicioHorario.value);
    let HorarioFin = new Date(this.formSchedule.controls.frmFinHorario.value);
    listServiciosPrevios.forEach((x: any)=>{
      let primeraFecha = new Date(`${x.fecha} ${x.horaInicio}`);
      let limiteFecha = new Date(`${x.fecha} ${x.horaFin}`);
      if ((primeraFecha.getTime() <= HorarioInicio.getTime() && HorarioInicio.getTime() < limiteFecha.getTime()) || (primeraFecha.getTime() < HorarioFin.getTime() && limiteFecha.getTime() >= HorarioFin.getTime())) {
        this.notificacionService.warning('El horario seleccionado se superpone a uno existente de '+ formatDate(primeraFecha, 'hh:mm aa', this.locale) + ' - ' + formatDate(limiteFecha, 'hh:mm aa', this.locale))
        error = true;
      }
    })
    if (error) {
      return false;
    }
    else{
      return true;
    }
  }
  // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  onSave(){
    if (this.ctrlPersonalizado.value && (typeof this.ctrlCiram.value !== 'object')) {
      this.ctrlCiram.markAllAsTouched()
    }
    else if (this.formSchedule.valid && this.dataTipo && this.ctrlDireccion.valid) {
      if (this.validateAsignacionFecha()) {
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
