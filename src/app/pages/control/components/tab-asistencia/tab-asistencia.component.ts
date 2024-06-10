import { Dialog } from '@angular/cdk/dialog';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RequestBuscarApto } from '@models/control/asistencia/crud-asistencia.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { Parametro } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { DialogConfirmDataAsistenciaComponent } from './dialog/dialog-confirm-data-asistencia/dialog-confirm-data-asistencia.component';
import { RequestCambioHorario, RequestRegisterDet } from '@models/control/asistencia/service-asistencia.model';
import { debounceTime } from 'rxjs';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'esp-tab-asistencia',
  templateUrl: './tab-asistencia.component.html',
  styleUrls: ['./tab-asistencia.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class TabAsistenciaComponent {
  status: RequestStatus = 'init';
  // Lista de Asistentes ----------------------------------------------------------
  listPreInscritos: any[] = [];
  listAsistentes: any[] = [];
  ctrlSeleccionados = new FormControl();
  ctrlMarcarAsistencia = new FormControl(false);
  // ------------------------------------------------------------------------------
  // Lista de Asegurados para Búsqueda --------------------------------------------
  listBusqueda: any[] = [];
  listFilteredBusqueda: any[] = [];
  flagListas: boolean = false;
  // ------------------------------------------------------------------------------
  // Control de Paginación --------------------------------------------------------
  dataPaginada: any;
  // ------------------------------------------------------------------------------
  // Control del Tiempo -----------------------------------------------------------
  ctrlTiempo = new FormControl();
  ctrlFinSesion = new FormControl();
  bloqueo: boolean = true;
  // ------------------------------------------------------------------------------
  // Información Intermedia--------------------------------------------------------
  detalleAsistenciaActual: any;
  // ------------------------------------------------------------------------------
  opciones: Parametro[] = [];
  ctrlSearch = new FormControl('');
  ctrlTypeSearch = new FormControl(1);
  // Buscar por DNI------------------- --------------------------------------------
  public formBuscarPersona = this.fb.nonNullable.group({
    frmSelectDoc: new FormControl(''),
    frmDoc: ['', [Validators.required, Validators.minLength(8)]],
  });
  esperaBusqueda: boolean = false;
  esperaBusquedaAsegurados: boolean = true;
  // ------------------------------------------------------------------------------
  faSpinner = faSpinner;
  comienzoSesiones = 1;
  datoProgramacion: any;

  constructor(private fb                                : FormBuilder,
              private router                            : Router,
              private dialog                            : Dialog,
              private datosService                      : DatosGeneralesService,
              private controlService                    : ControlProgramacionService,
              @Inject(LOCALE_ID) private locale         : string,
              private notificacionService               : NotificationService,
              ) { }

  ngOnInit(){
    this.setListeners();
    this.getListAsegurados();
    this.getDataCabecera();
    this.getParametros();
  }

  setListeners(){
    this.ctrlSearch.valueChanges.subscribe((data)=>{
      if (typeof data !== 'object') {
        this.listFilteredBusqueda = this.listBusqueda.filter((item)=> item.nombreCompleto.toLowerCase().includes(data!.toLowerCase()) || item.numDoc.includes(data));
      }
    })
    this.ctrlSeleccionados.valueChanges.subscribe((data)=>{
      if (data) {
        this.listAsistentes.forEach((x)=>{
          x.formCheck.setValue(true);
        })
      }
      else{
        this.listAsistentes.forEach((x)=>{
          x.formCheck.setValue(false);
        })
      }
      console.log(data)
    })
  }
  // Lista de Asistentes ------------------------------------------------------------------------
  getSeleccionadosCheck(): any[]{
    return this.listAsistentes.filter((x)=> x.formCheck.value)
  }

  deleteSelected(){
    let listEliminar = this.listAsistentes.filter((x)=> x.formCheck.value);
    if (listEliminar.length > 0) {
      let idEliminar = listEliminar.map(item => item.idControlAsistenciaSubDet);
      this.controlService.deleteElegidos(idEliminar).subscribe((data)=>{
        if (data.code == 0) {
          this.notificacionService.success('Se eliminaron los registros seleccionados');
          this.getListAsistencia();
        }
        else{
          this.notificacionService.warning(data.message);
        }
      })
      console.log()
    }
  }

  tomarAsistencia(){
    this.ctrlMarcarAsistencia.setValue(!this.ctrlMarcarAsistencia.value);
  }
  // --------------------------------------------------------------------------------------------

  // Busqueda y Tipeo de Asegurado --------------------------------------------------------------
  onAseguradoSelect(event: any){
    let payload: RequestBuscarApto = {
      idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      tipDoc: event.option.value.tipoDoc === 'DNI' ? '1' : '4',
      numDoc: event.option.value.numDoc
    }
    this.controlService.getSiEsApto(payload).subscribe((data)=>{
      if (data.code == 0 || data.code == 2) {
        let conexion: boolean;
        if (data.code == 2) {
          conexion = false;
        }
        else{
          conexion = true;
        }
        if (!data.data[0].acreditacion) {
          this.notificacionService.warning(data.message);
        }
        this.controlService.registerAseguradoDetalle({idControlAsistenciaDet: this.dataPaginada.idControlAsistenciaDet, idFichaAdmision: data.data[0].idFichaAsegurado, conConexion: conexion}).subscribe((datos)=>{
          if (datos.code == 0) {
            if (this.dataPaginada.numeracion == 1) {
              if (this.listPreInscritos.some((x: any)=> x.numDoc == data.data[0].numDoc)) {
                this.controlService.registerAsistenciaAsistira({idProgramacionDet: JSON.parse(localStorage.getItem('idProgramElegida')!), idFichaAdmision: data.data[0].idFichaAsegurado}).subscribe((dataAsistira)=>{
                  if (dataAsistira.code == 0) {
                    this.getListAsistencia();
                    this.getListPreInscritos();
                    this.notificacionService.success('Se ha registrado la asistencia');
                  }
                  else{
                    this.notificacionService.warning(dataAsistira.message);                
                  }
                })
              }
              else{     
                this.getListAsistencia();       
                this.notificacionService.success('Se ha registrado la asistencia');
              }
            }
            else{
              this.getListAsistencia();
              this.notificacionService.success('Se ha registrado la asistencia');
            }            
          }
          else{
            this.notificacionService.warning(datos.message);
          }
        })
      }
      else{
        this.notificacionService.warning(data.message);
      }
      this.esperaBusqueda = false;
    })

    this.ctrlSearch.setValue('');
  }
  displayAseguradoFiltered(selectedoption: any) {
    return selectedoption ? selectedoption.nombreCompleto : undefined;
  }

  searchSiApto(tipoDoc: string, numDoc: string){
    let payload: RequestBuscarApto = {
      idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      tipDoc: tipoDoc,
      numDoc: numDoc
    }
    this.esperaBusqueda = true;
    this.controlService.getSiEsApto(payload).subscribe((data)=>{
      if (data.code == 0 || data.code == 2) {
        let conexion: boolean;
        if (data.code == 2) {
          this.notificacionService.warning(data.message);
          conexion = false;
        }
        else{
          conexion = true;
        }
        const dialogRef = this.dialog.open(DialogConfirmDataAsistenciaComponent,{
          minWidth:'850px',
          maxWidth:'50%',
          data:{
            infoAsegurado: data,
            detalleAsistenciaActual: this.dataPaginada,
            conConexion: conexion,
            listPreInscritos: this.listPreInscritos
          }
        })
        dialogRef.closed.subscribe(result => {
          if (result == 1) {
            this.getListAsistencia();
          }
          else if (result == 2) {
            this.getListAsistencia();
            this.getListPreInscritos();
          }
        });
      }
      else{
        this.notificacionService.warning(data.message);
      }
      this.esperaBusqueda = false;
    })
  }
  // --------------------------------------------------------------------------------------------
  // Control de Paginación ----------------------------------------------------------------------
  validateActivo(direccion: number): boolean{ // 0: Izquierda - 1: Derecha
    let validator: boolean = false;
    if (this.datoProgramacion.numSesiones > 1) {
      if (direccion == 0) {
        if (this.dataPaginada.numeracion > 1) {
          let getSesionPrevia = this.datoProgramacion.listaProgSubDet.find((x: any) => x.numeracion == (this.dataPaginada.numeracion - 1));
          if (getSesionPrevia.cerradoAsistencia){
            validator = true;
          }
        }
      }
      else if (direccion == 1){
        if (this.dataPaginada.numeracion < this.datoProgramacion.numSesiones) {
          let getSesionSiguiente = this.datoProgramacion.listaProgSubDet.find((x: any) => x.numeracion == (this.dataPaginada.numeracion + 1));
          if (getSesionSiguiente.cerradoAsistencia) {
            validator = true;
          }
        }
      }
    }
    return validator
  }

  getDataPaginada(direccion: number){
    this.flagListas = true;
    let sesionCambiar: any;
    if (direccion == 0) {
      sesionCambiar = this.datoProgramacion.listaProgSubDet.find((x: any) => x.numeracion == (this.dataPaginada.numeracion - 1));
    }
    else if (direccion == 1) {
      sesionCambiar = this.datoProgramacion.listaProgSubDet.find((x: any) => x.numeracion == (this.dataPaginada.numeracion + 1));
    }
    let payload: RequestRegisterDet = {
      idControlAsistenciaCab: this.datoProgramacion.idControlAsistenciaCab,
      idProgramacionSubDet: sesionCambiar.idProgSubDet,
      numeracion: sesionCambiar.numeracion
    }
    this.controlService.registerAsistenciaDet(payload).subscribe((data)=>{
      if (data.code == 0) {
        this.dataPaginada = data.data;
        if (this.dataPaginada.numeracion == 1) {
          this.getListPreInscritos();
        }
        this.getListAsistencia();
      }
      else{
        this.flagListas = false;
        this.notificacionService.warning(data.message);
      }
    });
  }
  // --------------------------------------------------------------------------------------------

  getParametros(){
    this.datosService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data) =>{
      if (data.code == 0) {
        this.opciones = data.data;
      }
      else{
        this.notificacionService.warning(data.message);
      }
    });
  }

  getListAsegurados(){
    this.esperaBusquedaAsegurados = true;
    this.controlService.getListAsegurados().subscribe((data)=>{
      if (data.code == 0) {
        this.esperaBusquedaAsegurados = false;
        this.listBusqueda = data.data;
        this.ctrlSearch.setValue('');
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })
  }

  getListAsistencia(){
    this.controlService.getListAsistencia(this.dataPaginada.idControlAsistenciaDet).subscribe((data)=>{
      if (data.code == 0) {
        data.data.forEach((element: any) => {
          element.formCheck = new FormControl(false);
          element.formAsistido = new FormControl(element.continuaTaller);
          element.formAsistido.valueChanges.subscribe((x: any)=>{
            this.controlService.registerContinuacionAsistencia(element.idControlAsistenciaSubDet, x).subscribe((dataContinuacion)=>{
              if (dataContinuacion.code == 0) {
                console.log(element, x)
              }
              else{
                this.notificacionService.warning(dataContinuacion.message);
              }
            })
          })
        });
        this.listAsistentes = data.data;
        this.listAsistentes.sort((a: any, b: any) => {return new Date(b.fechaHoraAsistencia).getTime()  - new Date(a.fechaHoraAsistencia).getTime()});
        this.flagListas = false;
        this.status = 'success';
      }
      else{
        this.status = 'failed';
        this.notificacionService.warning(data.message);
      }
    })
  }

  getListPreInscritos(){
    this.listPreInscritos = [];
    this.controlService.getListaPreInscritos(JSON.parse(localStorage.getItem('idProgramElegida')!)).subscribe((data)=>{
      if (data.code == 0) {
        this.flagListas = false;
        this.listPreInscritos = data.data;
      }
      else {
        this.notificacionService.warning(data.message);
      }
    })
  }

  getDataCabecera(){
    this.controlService.getCabeceraAsistencia(JSON.parse(localStorage.getItem('idProgramElegida')!)).subscribe((data)=>{
      if (data.code == 0) {
        this.datoProgramacion = data.data;
        console.log(data.data)
        let seconds = Math.floor((new Date(this.datoProgramacion.fechaServicio + ' ' + this.datoProgramacion.horaFin).getTime() - new Date(this.datoProgramacion.fechaServicio + ' ' + this.datoProgramacion.horaInicio).getTime())/1000);
        let horas = Math.floor(seconds/(60*60));
        let minutos = Math.floor(seconds/60) - horas*60;
        this.datoProgramacion.margenHorario = horas + 'h ' +  minutos + ' m';
        this.registerHoraActiva()
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })
  }

  registerHoraActiva(){
    let subActivo = this.datoProgramacion.listaProgSubDet.find((item: any)=> item.cursor == true);
    let sinSesion = false;
    let sesionActiva: any;
    if (subActivo) {
      sesionActiva = subActivo;
    }
    else{
      sesionActiva = this.datoProgramacion.listaProgSubDet[0];
      sinSesion = true;
    }
    this.comienzoSesiones = sesionActiva.numeracion;
    let payload: RequestRegisterDet = {
      idControlAsistenciaCab: this.datoProgramacion.idControlAsistenciaCab,
      idProgramacionSubDet: sesionActiva.idProgSubDet,
      numeracion: sesionActiva.numeracion
    }
    this.controlService.registerAsistenciaDet(payload).subscribe((data)=>{
      if (data.code == 0) {
        this.detalleAsistenciaActual = data.data;
        this.dataPaginada = data.data;
        if (this.detalleAsistenciaActual.numeracion == 1) {
          this.getListPreInscritos();
        }
        console.log(this.detalleAsistenciaActual)
        this.calculoDistanciaTiempo(sesionActiva);
        this.getListAsistencia();
        if (sinSesion) {
          this.controlService.registerFijarCursor(this.datoProgramacion.idControlAsistenciaCab, this.detalleAsistenciaActual.idControlAsistenciaDet).subscribe((dataCursor)=>{
            if (dataCursor.code == 0) {
              this.controlService.registerCierreDetalle(this.detalleAsistenciaActual.idControlAsistenciaDet).subscribe((dataCierre)=>{
                if (dataCierre.code == 0) {
                  this.getDataCabecera()
                }
                else{
                  this.notificacionService.warning(dataCierre.message);
                }
              })
            }
            else{
              this.notificacionService.warning(dataCursor.message);
            }
          })
        }
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })
  }

  calculoDistanciaTiempo(sesionActiva: any){
    this.ctrlFinSesion.setValue(null, {emitEvent: false});
    this.bloqueo = true;
    if (!sesionActiva.cerradoAsistencia) {
      this.bloqueo = false;      
    }
    else{
      let thisTime = new Date();
      let finTaller = new Date(this.datoProgramacion.fechaServicio + ' ' + sesionActiva.horaFin);
      console.log(this.datoProgramacion.fechaServicio + ' ' + sesionActiva.horaFin)
      if (finTaller.getTime() <= thisTime.getTime()) {
        this.bloqueo = false;
      }
      else{
        let timerFinal = finTaller.getTime() - new Date().getTime();
        this.ctrlFinSesion?.valueChanges.pipe(debounceTime(timerFinal)).subscribe(key => {
          if (timerFinal == this.ctrlFinSesion.value) {
            this.bloqueo = false;
          }
        })
        this.ctrlFinSesion.setValue(timerFinal);        
      }
    }

  }

  cambioHora(){
    if (this.detalleAsistenciaActual.numeracion < this.datoProgramacion.numSesiones) {
      this.status = 'loading';
      let sgteProgramSubDet = this.datoProgramacion.listaProgSubDet[this.datoProgramacion.listaProgSubDet.findIndex((element: any) => element.numeracion == this.detalleAsistenciaActual.numeracion) + 1];

      let payloadCambioHorario: RequestCambioHorario = {
        idControlAsistenciaDetActual: this.detalleAsistenciaActual.idControlAsistenciaDet,
        numeracionActual: this.detalleAsistenciaActual.numeracion,
        idControlAsistenciaCabActual: this.datoProgramacion.idControlAsistenciaCab,
        idProgramacionSubDetSiguiente: sgteProgramSubDet.idProgSubDet,
        numeracionSiguiente: sgteProgramSubDet.numeracion
      }
      this.controlService.registerCambioHorario(payloadCambioHorario).subscribe((data)=>{
        if (data.code == 0) {
          this.controlService.registerFijarCursor(this.datoProgramacion.idControlAsistenciaCab, data.data.idControlAsistenciaDet).subscribe((dataCursor)=>{
            if (dataCursor.code == 0) {
              this.getDataCabecera();
            }
            else{
              this.notificacionService.warning(dataCursor.message);
            }
          })

        }
        else {
          this.notificacionService.warning(data.message);
        }
      })
    }
    else if (this.detalleAsistenciaActual.numeracion == this.datoProgramacion.numSesiones){
      this.status = 'loading';
      this.controlService.registerCierreTaller(this.datoProgramacion.idControlAsistenciaCab).subscribe((dataCierre)=>{
        if (dataCierre.code == 0) {
          localStorage.removeItem('idProgramElegida');
          this.router.navigate(['/app/control/mis-talleres']);
          this.notificacionService.success('¡Se ha registrado las asistencias en el taller!');
          this.status = 'success';          
        }
        else {
          this.status = 'failed';
          this.notificacionService.warning(dataCierre.message);
        }
      })

    }

  }

  cerrarAsistencia(){
    this.status = 'loading';
    this.controlService.registerCierreDetalle(this.dataPaginada.idControlAsistenciaDet).subscribe((dataCierre)=>{
      if (dataCierre.code == 0) {
        this.getDataCabecera();
      }
      else{
        this.notificacionService.warning(dataCierre.message);
      }
    })
  }
  
}
