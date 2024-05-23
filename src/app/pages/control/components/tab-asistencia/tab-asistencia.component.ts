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
import { RequestRegisterDet } from '@models/control/asistencia/service-asistencia.model';

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
  listAsistentes: any[] = [];
  ctrlSeleccionados = new FormControl();
  ctrlMarcarAsistencia = new FormControl(false);
  // ------------------------------------------------------------------------------
  // Lista de Asegurados para Búsqueda --------------------------------------------
  listBusqueda: any[] = [];
  listFilteredBusqueda: any[] = [];
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
    console.log(new Date('2024-05-22 21:00'))
    console.log((new Date('2024-05-22 21:00').getTime() - new Date().getTime())/(1000*60))
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
    console.log(this.getSeleccionadosCheck())
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
      if (data.code == 0) {
        if (!data.data[0].acreditacion) {
          this.notificacionService.warning(data.message);
        }
        this.controlService.registerAseguradoDetalle({idControlAsistenciaDet: this.detalleAsistenciaActual.idControlAsistenciaDet, idFichaAdmision: data.data[0].idFichaAsegurado}).subscribe((datos)=>{
          if (datos.code == 0) {
            console.log(datos.data);
            this.getListAsistencia();
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
    this.ctrlSearch.setValue(event.option.value, {emitEvent: false});
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
      if (data.code == 0) {
        console.log(data.data);
        const dialogRef = this.dialog.open(DialogConfirmDataAsistenciaComponent,{
          minWidth:'850px',
          maxWidth:'50%',
          data:{
            infoAsegurado: data,
          }
        })
        dialogRef.closed.subscribe(result => {
          console.log(result);
          if (result == 1) {
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
    this.controlService.getListAsegurados().subscribe((data)=>{
      if (data.code == 0) {
        this.listBusqueda = data.data;
        this.ctrlSearch.setValue('');
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })
  }

  getListAsistencia(){
    this.controlService.getListAsistencia(this.detalleAsistenciaActual.idControlAsistenciaDet).subscribe((data)=>{
      if (data.code == 0) {
        data.data.forEach((element: any) => {
          if (!this.listAsistentes.find((x)=> x.nroDocumento == element.nroDocumento)) {
            element.formCheck = new FormControl(false);
            element.formAsistido = new FormControl('SI');
            this.listAsistentes.push(element);
          }
        });
        this.listAsistentes.sort((a: any, b: any) => {return new Date(b.fechaHoraAsistencia).getTime()  - new Date(a.fechaHoraAsistencia).getTime()})
        console.log(this.listAsistentes)
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })
  }

  getDataCabecera(){
    this.controlService.getCabeceraAsistencia(JSON.parse(localStorage.getItem('idProgramElegida')!)).subscribe((data)=>{
      if (data.code == 0) {
        console.log(data.data)
        this.datoProgramacion = data.data;
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
    let sesionActiva = this.datoProgramacion.listaProgSubDet[0];
    let payload: RequestRegisterDet = {
      idControlAsistenciaCab: this.datoProgramacion.idControlAsistenciaCab,
      idProgramacionSubDet: sesionActiva.idProgSubDet,
      numeracion: sesionActiva.numeracion
    }

    this.controlService.registerAsistenciaDet(payload).subscribe((data)=>{
      if (data.code == 0) {
        this.detalleAsistenciaActual = data.data;
        this.getListAsistencia();
        console.log(data.data)
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })

  }

}
