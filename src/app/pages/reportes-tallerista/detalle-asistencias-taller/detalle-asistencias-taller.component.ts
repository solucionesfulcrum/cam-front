import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { imprimirRequestCam } from '@models/afiliados/ficha-solicitud.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { ReportesTalleristaPayload } from '@models/reportes/reportes-tallerista';
import { NotificationService } from '@services/notification.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { ParamMenu } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ProgramacionContratosService } from 'src/app/data/services/programacion/programacion-contratos.service';
import { ReportesTalleristaService } from 'src/app/data/services/reportes/reportes-tallerista.service';

interface sesiones {
  participantes: number;
  nroSesion: number;
}

@Component({
  selector: 'esp-detalle-asistencias-taller',
  templateUrl: './detalle-asistencias-taller.component.html',
  styleUrls: ['./detalle-asistencias-taller.component.scss']
})
export class DetalleAsistenciasTallerComponent {
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Modificar Asistencias', colorBtn: 'bordeado'},
    {texto: 'Finalizar', colorBtn:'mezclado'},
  ];
  idProgramacion!: string;
  rutasContrato=[
    {url:`/app/programacion/show/${this.idProgramacion}`, title:'Servicios Contratados'},
    {url:`/app/programacion/show/${this.idProgramacion}/programados`, title:'Servicios Programados'},
  ];
  faSpinner = faSpinner;
  dataContrato: any;

  sessionSeleccionada : number = 1;
  sesiones : sesiones[] = [
    {participantes: 20, nroSesion: 1},
    {participantes: 30, nroSesion: 2},
    {participantes: 40, nroSesion: 3},
  ]

  opciones: Parametro[] = [];

  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
  });

  dataAcciones: ParamMenu[] = [
    {texto: 'Descargar Excel', svgDir: 'assets/svg/icon-excel.svg'}
  ];

  dataSource: any[] = [];
  columns: string[] = [
    'marcar',
    'indice',
    'asegurado',
    'documento',
    'nro_documento', 
    'hora_asistencia', 
    'condicion', 
  ];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;

  loadingData : boolean = false;
  
  constructor( private fb                      : FormBuilder,
    private programacionService     : ProgramacionContratosService,
    private datosService             : DatosGeneralesService,
    private notificationService     : NotificationService,
    private reportService : ReportesTalleristaService){
      
    }

    ngOnInit(){
      this.datosService.getTipoParametros('ESTADO_CONTROL_ASISTENCIA').subscribe((data)=>{
        if (data.code == 0) {
          this.opciones = data.data;
        }
        else{
          this.notificationService.warning(data.message);
        }
      });
      this.loadData();
    }
    
    loadData(){
    
      setTimeout(() => {
        this.loadingData = true;
        this.reportService.getDataReporteAsistenciaTaller(this.getPayloadList()).subscribe((data)=>{
          this.loadingData = false;
          if (data.code == 0) {
            this.dataSource = data.data.list;
            this.pageNum = data.data.pageNum;
            this.total = data.data.total;
          }
          else {
            this.notificationService.warning(data.message);
          }
        })
      });
      
    }
    
    imprimirLista(){
      var fecInicio: any;
      var fecFin: any;
      var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
      var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
      fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
      fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;
      var idUnidOpe = JSON.parse(localStorage.getItem("UnidElegida")!);
    
      let payload: imprimirRequestCam = {
        idUnidOpe: idUnidOpe.idUnidOperativa,
        texto: this.formBuscar.controls['frmSearch'].value,
        estado: parseInt(this.formBuscar.get('frmSearchEstado')?.value),
        fecInicio: fecInicio,
        fecFin: fecFin,
        codigoCam : this.formBuscar.get('frmCam')?.value
      };
    
    }
    
    
    getPayloadList(): ReportesTalleristaPayload{
      var fecInicio: any;
      var fecFin: any;
      
      fecInicio = '2024-01-01';
      fecFin = '2024-06-19'
    
      return {
        idUnidadOperativa: JSON.parse(localStorage.getItem("UnidElegida")!).idUnidOperativa,
        idUsuario: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario,
        texto: this.formBuscar.controls['frmSearch'].value,
        fecInicio: fecInicio,
        fecFin: fecFin,
        estado: this.formBuscar.get('frmSearchEstado')?.value,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
    }
    
    handlePageEvent(event: PageEvent) {
      this.pageSize = event.pageSize;
      this.pageIndex = event.pageIndex;
      this.pageNum = event.pageIndex + 1;
      this.loadData();
    }

    setSesion(nroSesion: number){
      this.sessionSeleccionada = nroSesion;
      this.loadData();
    }

  modificarAsistencia(){

  }

  finalizar(){

  }
}
