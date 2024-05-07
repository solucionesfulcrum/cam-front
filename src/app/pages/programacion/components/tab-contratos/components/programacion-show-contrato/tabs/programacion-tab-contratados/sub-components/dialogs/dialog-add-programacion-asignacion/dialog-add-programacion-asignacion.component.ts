import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  // Avanzado--------------------------------------------------------------------------------
  ctrlAvanzado = new FormControl(false);
  formSemanaDias = this.fb.nonNullable.group({
    0: this.fb.array([]),
    1: this.fb.array([]),
    2: this.fb.array([]),
    3: this.fb.array([]),
    4: this.fb.array([]),
    5: this.fb.array([]),
    6: this.fb.array([])
  })

  diaMin!: Date;
  diaMax!: Date;
  ctrlTermina = new FormControl(null);
  ctrlRepeticiones = new FormControl(null);
  ctrlDiaSelected = new FormControl('');
  // ----------------------------------------------------------------------------------------

  listServicios: ServiciosOrdenados[] = [];
  listFiltered: ServiciosOrdenados[] = [];
  listParamTipo: any[] = [];
  listaHorariosFiltrados: any[] = [];
  objValidacion: any = Object();
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
    this.ctrlAvanzado.disable()
    this.ctrlTipo.disable();
    console.log(new Date(this.data.dataContrato.fechInicio.replace(/-/g, '\/')))
    // this.getActividades();
    this.formSchedule.controls.frmInicioHorario.setValue(null!)
    this.setListeners();
    this.getParaametros();
    this.transformDataDates()
    this.listarHorariosDisponibles()
    // Creación Lista de Servicios con Ciram --------------------------------------------------------------
    this.ordenamientoServicios();
    // ----------------------------------------------------------------------------------------------------
    // Parámetros de programación avanzada ----------------------------------------------------------------
    this.diaMin = new Date(this.data.dataContrato.fechInicio.replace(/-/g, '\/'));
    this.diaMax = new Date(this.data.dataContrato.fechFin.replace(/-/g, '\/'))
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
        this.ctrlAvanzado.enable({ emitEvent: false});
        this.ctrlTipo.setValue(this.listParamTipo.find((datos)=> datos.nombre === data.tipoServicio).idParametros);
        this.dataTipo = this.listParamTipo.find((datos)=> datos.nombre === data.tipoServicio);
        this.comprobarLimiteSesiones(data.idServicio)
      }
      else{
        this.ctrlAvanzado.setValue(false, {emitEvent: false});
        this.ctrlAvanzado.disable({ emitEvent: false});
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
    this.ctrlAvanzado.valueChanges.subscribe((data)=>{
      if (data){
        this.ctrlTermina.addValidators(Validators.required);
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
    this.ctrlTermina.valueChanges.subscribe((data)=>{
      if (data == 1) {
        this.ctrlRepeticiones.setValidators([Validators.required]);
        this.ctrlDiaSelected.setValidators(null);
      }
      else{
        this.ctrlRepeticiones.setValidators(null);
        this.ctrlDiaSelected.setValidators([Validators.required])
      }
      this.ctrlRepeticiones.updateValueAndValidity();
      this.ctrlDiaSelected.updateValueAndValidity();
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
        if ((this.comprobarCantidadSesiones((this.ctrlServicio.value as any).idServicio) + count > 3) || this.comprobarSimilaridadSemana((this.ctrlServicio.value as any).idServicio).validacion || this.comprobarLimiteSesiones((this.ctrlServicio.value as any).idServicio) >= (this.data.dataContrato.nroEntregables*12) || this.comprobarAsignacionesUnidadOper((this.ctrlServicio.value as any).idServicio).validacion) { 
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
  comprobarAsignacionesUnidadOper(idServicio: any){
    let objRespuesta: any = Object();
    let listIdCiram: number[] = []; this.data.serviciosCiram.forEach((x: any)=>{listIdCiram.push(x.idUnidOpeCiram)});
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
      else{
        let contadorUnid: {idUnid?: number, nombre: string, contador: number}[] = [];
        contadorUnid.push({idUnid: undefined, nombre: this.data.serviciosContrato.cam, contador: 0})
        listSersionesAsig.forEach((element: any) => {
          if (element.idUoCiram == null) contadorUnid[0].contador += element.nroSesiones;          
        });
        listIdCiram.forEach((x) => {
          let cuentaUnid: number = 0;
          listSersionesAsig.forEach((element: any) => {
            if (element.idUoCiram == x) cuentaUnid += element.nroSesiones;          
          });
          contadorUnid.push({idUnid: x, nombre: this.data.serviciosCiram.find((z: any)=> z.idUnidOpeCiram == x).ciram, contador: cuentaUnid});
        })
        let encontradoFaltante: any;
        contadorUnid.forEach((r)=>{if (!encontradoFaltante) { if (r.contador % 12 != 0) {
          encontradoFaltante = r;
        }}})
        if (encontradoFaltante.contador % 3 == 0) {
          let serviciosCorrespondientes = listSersionesAsig.filter((x: any)=> ( encontradoFaltante.idUnid ? x.idUoCiram == encontradoFaltante.idUnid : x.idUoCiram == null ))
          let dataSemanaPasada: Date[] = [];
          let dataSemanaSiguiente: Date[] = [];
          let idUnidCompar: number = (this.ctrlPersonalizado.value && ( typeof this.ctrlCiram.value == 'object') ? (this.ctrlCiram.value as any).idUnidadOperativa : null);
          let encontrado: any;
          let cuentaFaltante = 0; serviciosCorrespondientes.forEach((seguid: any) => { cuentaFaltante += seguid.nroSesiones});
          let fechaEvaluar: Date;
          if (this.data.horarioFijo) {
            fechaEvaluar = this.data.fechaHorario;
          }
          else{
            fechaEvaluar = this.data.semanaElegida[0];
          }
          let diaInicio = new Date(fechaEvaluar.getTime() - 1000*60*60*24*fechaEvaluar.getDay() - 1000*60*60*24*7);
          let diaInicioSiguiente = new Date(fechaEvaluar.getTime() - 1000*60*60*24*fechaEvaluar.getDay() + 1000*60*60*24*7);
          for (let i = 0; i < 7; i++) {
            dataSemanaPasada.push(diaInicio);
            diaInicio = new Date(diaInicio.getTime() + 1000*60*60*24);
            dataSemanaSiguiente.push(diaInicioSiguiente);
            diaInicioSiguiente = new Date(diaInicioSiguiente.getTime() + 1000*60*60*24);
          }
          dataSemanaPasada.forEach((dia)=> {
            if (!encontrado) {
              serviciosCorrespondientes.forEach((servicio: any)=>{
                if (servicio.fecha == formatDate(dia, 'yyyy-MM-dd', this.locale) && servicio.idUoCiram == idUnidCompar) {
                  encontrado = servicio;
                }
              })
            }
          })
          dataSemanaSiguiente.forEach((dia)=> {
            if (!encontrado) {
              serviciosCorrespondientes.forEach((servicio: any)=>{
                if (servicio.fecha == formatDate(dia, 'yyyy-MM-dd', this.locale) && servicio.idUoCiram == idUnidCompar) {
                  encontrado = servicio;
                }
              })
            }
          })
          if (encontrado) {
            objRespuesta.validacion = false;
          }
          else{
            objRespuesta.message = `No se ha completado el entregable para este servicio, quedan ${12 - cuentaFaltante} asignaciones que deben ser continuas y en el mismo CAM o CIRAM.`;
            objRespuesta.validacion = true;
          }
        }
        else{
          let valid: boolean = false;
          this.data.semanaElegida.forEach((date: Date)=>{
            if (!valid) {
              listSersionesAsig.forEach((ses: any)=> {
                if (formatDate(date, 'yyyy-MM-dd', this.locale) == ses.fecha) {
                  valid = true;
                }
              })
            }
          })
          if (valid) {
            objRespuesta.validacion = false;
          }
          else{
            let diff = 3 - Math.floor(encontradoFaltante.contador/3);
            objRespuesta.message = `${diff == 2 ? 'Quedan': 'Queda'} ${diff} ${diff == 2 ? 'sesiones pendientes': 'sesión pendiente'} en ${encontradoFaltante.idUnid ? 'CIRAM ' + encontradoFaltante.nombre : 'CAM ' + encontradoFaltante.nombre} en otra semana`
            objRespuesta.validacion = true;
          }
        }
      }
    }
    this.objValidacion = objRespuesta;
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


  // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------Funciones de control de datos
  getFormGroup(control: AbstractControl) { return control as FormGroup; }

  addControlToDate(value: Date){
    let filaForm = this.fb.group({
      fechaAgendacion: new FormControl((value)),
      horaInicio: new FormControl(),
      horaFin: new FormControl(),
      cantCupos: new FormControl(0),
      listInit: new FormControl(this.getListDay(value)),
      listFin: new FormControl()
    })

    filaForm.controls.horaInicio.addValidators([Validators.required]);
    filaForm.controls.horaFin.addValidators([Validators.required]);

    filaForm.controls.horaFin.valueChanges.subscribe((data)=>{
      filaForm.controls.horaFin.setValue(new Date(data), {emitEvent: false})
      filaForm.controls.cantCupos.setValue(filaForm.controls.listFin.value.find((x: any)=> x.horaFin == data).cantidadCupos);
    })

    filaForm.controls.horaInicio.valueChanges.subscribe((data)=>{
      filaForm.controls.horaFin.setValue(null, {emitEvent: false})
      filaForm.controls.cantCupos.setValue(0, {emitEvent: false})
      filaForm.controls.listFin.setValue(this.getFinList(new Date(data)))
    })
    this.getControlDia(value.getDay()).push(filaForm);
  }

  getListDay(form: Date): any[]{
    let listHoraInicio: any[] = [];
    let fechaProgramada = form;
    this.data.dataRangosHorarios.forEach((x: any) => {
      let minutos = 0;
      for (let i = 0; i < 4; i++) {
        listHoraInicio.push({horaSeleccionable: new Date(`${formatDate(fechaProgramada, 'yyyy-MM-dd', this.locale)} ${x.split(' ')[0]}:${minutos} ${x.split(' ')[1]}`), deshabilitado: false});
        minutos+=15;
      }
    });
    return listHoraInicio;
  }

  getFinList(dia: Date): any[]{
    let listFin: any[] = [];
    let count = 1;
    let secCount = 0;
    let infoTabla = (this.formSemanaDias.value as any)
    for (let i = 0; i < 7; i++) {
      infoTabla[i].forEach((element: any)=>{
        secCount += element.cantCupos;
      })      
    }
    let horaAumentada;
    do {
      if (count + secCount > 3) { 
        break;
      }
      horaAumentada = new Date (dia.getTime() + (1000*60*this.dataTipo.valor1)*(count))
      if (horaAumentada.getHours() > 20 || (horaAumentada.getHours() == 20 && horaAumentada.getMinutes() != 0)) {
        break;
      }
      listFin.push({horaFin: horaAumentada, deshabilitado: false, cantidadCupos: count})
      count += 1;
    } while (horaAumentada.getHours() < 20);

    return listFin;
  }

  comprobacionesAvanzadas(): any{
    let valueReturned: any = Object();
    let infoTabla = (this.formSemanaDias.value as any);
    let dataTable: any[] = [];
    for (let i = 0; i < 7; i++) {
      infoTabla[i].forEach((element: any)=>{
        dataTable.push(element);
      })      
    }
    if (dataTable.length == 0) {
      valueReturned.validacion = false;
      this.notificacionService.warning('Debe ingresar almenos una asignación en la programación avanzada');
    }
    else{
      valueReturned.validacion = true;
    }
    return valueReturned;
  }

  getDataAsignacion(){
    let infoTabla = (this.formSemanaDias.value as any);
    let dataTable: any[] = [];
    for (let i = 0; i < 7; i++) {
      let asignacionDia: any = Object();
      let listAsig: any[] = [];
      infoTabla[i].forEach((element: any, index: number)=>{
        if (index == 0) {
          asignacionDia.dia = element.fechaAgendacion;
        }
        listAsig.push(element);
      });
      if (listAsig.length > 0) {
        asignacionDia.asignaciones = listAsig;
        dataTable.push(asignacionDia);
      }
    }
    if (this.ctrlTermina.value == 1) {
      // Data Armada ---------------------------------------------
      let dataEnviar: any[] = []
      // ---------------------------------------------------------
      dataTable.forEach((x)=>{
        let diaInicio: Date;
        if (x.dia.getTime() < this.diaMin.getTime()) {
          diaInicio = new Date(x.dia.getTime() + 1000*60*60*24*7);
        }
        else{
          diaInicio = x.dia;
        }
        for (let i = 0; i < this.ctrlRepeticiones.value!; i++) {
          let diaArmado: any = Object();
          let asignacionesDia: any[] = [];
          diaArmado.fecha = new Date(diaInicio.getTime() + 1000*3600*24*7*i);
          if (diaArmado.fecha.getTime() <= this.diaMax.getTime()) {
            x.asignaciones.forEach((med: any)=>{
              asignacionesDia.push({horaInicio: new Date(med.horaInicio), horaFin: med.horaFin, sesiones: med.cantCupos})
            })
          }
          diaArmado.listaAsig = asignacionesDia;
          if (asignacionesDia.length > 0) {
            dataEnviar.push(diaArmado)
          }
        }
      })
      this.armadoPayloadEnvio(dataEnviar)
    }
  }

  armadoPayloadEnvio(dataEnviar: any[]){
    this.status = 'loading';
    dataEnviar.forEach((x, index)=>{
      if (this.status == 'loading') {
        this.programacionService.registerAsignacionesDia(this.getPayloadAvanzado(x)).subscribe((data)=>{
          if (data.code == 0) {
            if ((index + 1) == dataEnviar.length) {
              this.status = 'success';
              this.notificacionService.success('Se registraron las asignaciones satisfactoriamente');
              this._dialogRef.close(1);
            }
          }
          else {
            this.status = 'failed';
            this.notificacionService.warning(data.message);
          }
        })
      }
    })
  }

  getPayloadAvanzado(data: any): ProgramacionRequestRegisterServicio{
    let listServicios: DetallesServicio[] = [];
    let listServiciosPrevios = this.data.infoServiciosContratados.filter((x: any)=>{ return x.fecha == formatDate(data.fecha, 'yyyy-MM-dd', this.locale)});
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
    data.listaAsig.forEach((x: any)=>{
      listServicios.push({
        idServicio: (this.ctrlServicio.value! as any).idServicio,
        horaInicio: formatDate(x.horaInicio, 'HH:mm', this.locale),
        horaFin: formatDate(x.horaFin, 'HH:mm', this.locale),
        nroSesiones: x.sesiones,
        duracion: (this.dataTipo.valor1 ? this.dataTipo.valor1 : 60),
        paramServicioTipoId: this.dataTipo.idParametros,
        idUoCiram: (this.ctrlPersonalizado.value ? (this.ctrlCiram.value! as any).idUnidadOperativa : null),
        ubicacion: this.ctrlDireccion.value!
      })
    })

    let objPayload: ProgramacionRequestRegisterServicio = {
      idProgramacion: this.data.dataContrato.idProgramacion,
      fecha: formatDate(data.fecha, 'yyyy-MM-dd', this.locale),
      detalles: listServicios
    };

    return objPayload;
  }

  getControlDia(value: any) {
    return this.formSemanaDias.controls[value as keyof typeof this.formSemanaDias.controls] as FormArray;
  }

  deleteElement(dateIndex: number, elementIndex: number) {
    this.getControlDia(dateIndex).removeAt(elementIndex);
  }
  // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  onSave(){
    if (this.ctrlPersonalizado.value && (typeof this.ctrlCiram.value !== 'object')) {
      this.ctrlCiram.markAllAsTouched()
    }
    else {
      if (this.ctrlAvanzado.value) {
        if (this.formSemanaDias.valid && this.ctrlTermina.valid && this.ctrlRepeticiones.valid && this.ctrlDiaSelected.valid  && this.ctrlDireccion.valid && this.comprobacionesAvanzadas().validacion) {
          this.getDataAsignacion();
        }
        else{
          this.formSemanaDias.markAllAsTouched();
          this.ctrlTermina.markAllAsTouched();
          this.ctrlRepeticiones.markAllAsTouched();
          this.ctrlDiaSelected.markAllAsTouched();
          this.ctrlServicio.markAllAsTouched();
          this.ctrlDireccion.markAllAsTouched()
        }
      }
      else{
        if (this.formSchedule.valid && this.dataTipo && this.ctrlDireccion.valid) {
          if (this.validateAsignacionFecha()) {
            this.status = 'loading';
            this.programacionService.registerAsignacionesDia(this.getPayloadRegistro()).subscribe((data)=>{
              if (data.code == 0) {
                this.status = 'success';
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
