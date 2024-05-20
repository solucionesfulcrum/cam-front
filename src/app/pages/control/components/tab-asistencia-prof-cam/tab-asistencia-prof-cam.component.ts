import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AsistenciaLista, DataResponse, RequestBuscarApto } from '@models/control/asistencia/crud-asistencia.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { DataSourceList } from './data-source';


import { data } from 'autoprefixer';
import { Dialog } from '@angular/cdk/dialog';
import { DialogConfirmDataAsistenciaComponent } from '../tab-asistencia/dialog/dialog-confirm-data-asistencia/dialog-confirm-data-asistencia.component';

@Component({
  selector: 'esp-tab-asistencia-prof-cam',
  templateUrl: './tab-asistencia-prof-cam.component.html',
  styleUrls: ['./tab-asistencia-prof-cam.component.scss']
})
export class TabAsistenciaProfCamComponent {
  status: RequestStatus = 'init';
  listAsistentes: any[] = [];
  opciones: Parametro[] = [];
  ctrlSearch = new FormControl('');
  ctrlTypeSearch = new FormControl(1);
  public formNewContrato = this.fb.nonNullable.group({
    frmSelectDoc: new FormControl(''),
    frmDoc: ['', [Validators.required, Validators.minLength(8)]],
  });
  faSpinner = faSpinner;
  comienzoSesiones = 1;
  datoProgramacion: any;

  listBusqueda: any[] = [];
  listFilteredBusqueda: any[] = [];

  public formBuscarPersona = this.fb.nonNullable.group({
    frmSelectDoc: new FormControl(''),
    frmDoc: ['', [Validators.required, Validators.minLength(8)]],
  });

  esperaBusqueda: boolean = false;

  dataSourceList = new DataSourceList();


  //DATA PRUEBA
  dataPrueba: AsistenciaLista[] = [];
  dataSource: AsistenciaLista[] = [];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;
  columns: string[] = ['marcar',
    'orden',
    'nombreCompleto',
    'tipoDoc',
    'numDoc',
    'horaAsistencia',
    'birthday'
  ];

  /*
  marcar: boolean;
    orden: number;
    
    nombreCompleto: string;
    birthday : false;
    horaAsistencia: string;
    aseguradoNuevo: false;
    tipoDoc: string;
    numDoc: string;
  */

  constructor(private fb                                : FormBuilder,
              private router                            : Router,
              private datosService                      : DatosGeneralesService,
              private controlService                    : ControlProgramacionService,
              @Inject(LOCALE_ID) private locale         : string,
              private notificacionService               : NotificationService,
              private dialog                            : Dialog,
              ) { }

  ngOnInit(){
    console.log(JSON.parse(localStorage.getItem('idProgramElegida')!))
    this.getDataCabecera();
    this.getParametros();
    this.getListAsegurados();
    this.getListTablaAsegurados();
    this.setListeners();
  }

  getParametros(){
    this.datosService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data) =>{
      console.log(data);
      this.opciones = data.data;
    });
  }

  setListeners(){
    this.ctrlSearch.valueChanges.subscribe((data)=>{
      console.log(data)
      if (typeof data !== 'object') {
        this.listFilteredBusqueda = this.listBusqueda.filter((item)=> item.nombreCompleto.toLowerCase().includes(data!.toLowerCase()) || item.numDoc.includes(data));
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

  differenceInDays(date1: string): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffInTime = (new Date().getTime()) - (new Date(date1)).getTime();
    return Math.round(diffInTime / oneDay) - 1;
  }

  handlePageEvent(event: PageEvent) {
    // console.log(this.pageSizeOptions);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    //this.onLoadData();
  }

  afectarTodo(evento: Event): void{
    let element = evento.target as HTMLInputElement;
    this.dataSource = this.dataSource.map(data => { return {...data, marcar: Boolean(element.checked)}});
  }

  getListTablaAsegurados() : void{
    this.controlService.listarAsistencia({
      idProgDet: String(JSON.parse(localStorage.getItem('idProgramElegida')!)),
      pageSize: 5,
      pageNum: 1
    })
    .subscribe(data => {
      let dataAsistentes = (data.data as AsistenciaLista[]).map((asistente : AsistenciaLista, index: number)=>{
        return {...asistente, orden: index, marcar: false}
      });

      this.llenarDatosTabla({
        data: {
          list: dataAsistentes,
          pageNum: 1,
          pageSize: 5,
          total: dataAsistentes.length
        }
      });

    });
  }

 
  llenarDatosTabla(data : DataResponse<AsistenciaLista>){
    this.dataSource = data.data.list;
    this.dataSourceList.init(data.data.list)

    this.pageNum = data.data.pageNum;
    this.pageSize = data.data.pageSize;
    this.total = data.data.total;
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


}
