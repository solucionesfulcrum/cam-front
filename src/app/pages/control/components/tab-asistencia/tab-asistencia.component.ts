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

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'esp-tab-asistencia',
  templateUrl: './tab-asistencia.component.html',
  styleUrls: ['./tab-asistencia.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class TabAsistenciaComponent {
  status: RequestStatus = 'init';
  listAsistentes: any[] = [];
  // Lista de Asegurados para Búsqueda --------------------------------------------
  listBusqueda: any[] = [];
  listFilteredBusqueda: any[] = [];
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
    this.setListeners();
    this.getListAsegurados();
    this.getDataCabecera();
    this.getParametros();
  }

  setListeners(){
    this.ctrlSearch.valueChanges.subscribe((data)=>{
      console.log(data)
      if (typeof data !== 'object') {
        this.listFilteredBusqueda = this.listBusqueda.filter((item)=> item.nombreCompleto.toLowerCase().includes(data!.toLowerCase()) || item.numDoc.includes(data));
      }
    })
  }

  // Busqueda y Tipeo de Asegurado --------------------------------------------------------------
  onAseguradoSelect(event: any){
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
            infoAsegurado: data.data[0],
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
        console.log(data.data)
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })
  }

  getDataCabecera(){
    this.controlService.getCabeceraProgramacion(JSON.parse(localStorage.getItem('idProgramElegida')!)).subscribe((data)=>{
      if (data.code == 0) {
        this.datoProgramacion = data.data;
        console.log(this.datoProgramacion)
        let seconds = Math.floor((new Date(this.datoProgramacion.fechaServicio + ' ' + this.datoProgramacion.horaFin).getTime() - new Date(this.datoProgramacion.fechaServicio + ' ' + this.datoProgramacion.horaInicio).getTime())/1000);
        let horas = Math.floor(seconds/(60*60));
        let minutos = Math.floor(seconds/60) - horas*60;
        this.datoProgramacion.margenHorario = horas + 'h ' +  minutos + ' m';
        console.log(Math.floor(seconds/(60*60)) + 'h ' +  Math.floor(seconds/60) + ' m')
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })
  }

}
