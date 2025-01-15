import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { RequestListTalleristaAsistenciaRapida } from '@models/reportes/reportes-asistencias.model';
import { NotificationService } from '@services/notification.service';
import { ParamMenu } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import * as saveAs from 'file-saver';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ReportesTalleristaService } from 'src/app/data/services/reportes/reportes-tallerista.service';

@Component({
  selector: 'esp-reporte-asistencia-rapida',
  templateUrl: './reporte-asistencia-rapida.component.html',
  styleUrls: ['./reporte-asistencia-rapida.component.scss']
})
export class ReporteAsistenciaRapidaComponent {
  listServicios: any[] = [];
  listEstados: any[] = [];
  waitDownload: boolean = false;
  
  formBuscar: FormGroup = this.fb.group({
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
    frmSearchServicio:new FormControl(),
  });
  dataAcciones: ParamMenu[] = [
    {texto: 'Descargar Excel', svgDir: 'assets/svg/icon-excel.svg'}
  ];

  dataSource: any[] = [];
  seleccionados : number[] = [];
  columns: string[] = [
    'marcar',
    'descripcion',
    'tipo',
    'fechaRegistro',
    'fechaServicio',
    'numTaller',
    'numSesion',
    'estado',
  ];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;
  loadingData : boolean = false;

  constructor(private fb                      : FormBuilder,
              private reporteService          : ReportesTalleristaService,
              private datosService            : DatosGeneralesService,
              private notificationService     : NotificationService,
  ){
     
  }

  ngOnInit(){
    this.getParamServices();
  }

  loadData(){
  setTimeout(() => {
    this.loadingData = true;
    
    this.reporteService.getListAsistenciasRapidas(this.getPayloadList()).then((data)=>{
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

  getParamServices(){
    this.datosService.getTipoParametros('ESTADO_ASISTENCIA_RAPIDA').subscribe((data)=>{
      if (data.code == 0) {
        this.listEstados = data.data.map(filtro => {
          return {...filtro, idParametros : parseInt(filtro.valor1)}
        });
      }
      else{
        this.notificationService.warning(data.message);
      }
    })

    this.datosService.buscarActivosServicio().subscribe((data)=>{
      if (data.code == 0) {
        this.listServicios = data.data.map((filtro : any) => {
          return {...filtro, valor1 : parseInt(filtro.idServicio)}
        });
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  getPayloadList(): RequestListTalleristaAsistenciaRapida{
    var fecInicio: any;
    var fecFin: any;
    var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
    var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
    fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
    fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;

    return{
      idUsuario: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario,
      idUnidadOperativa: JSON.parse(localStorage.getItem("UnidElegida")!).idUnidOperativa,
      fecInicio: fecInicio,
      fecFin: fecFin,
      estado: this.formBuscar.get('frmSearchEstado')?.value,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      idServicio: this.formBuscar.get('frmSearchServicio')!.value
    }
  }

  secDisplayValue(value: any){
    this.formBuscar.get('frmSearchServicio')?.setValue(value == "null" ? "" : value);
    this.loadData();
  }

  afectarTodo(evento: Event): void{
    let element = evento.target as HTMLInputElement;
    this.dataSource = this.dataSource.map(data => { return {...data, marcar: Boolean(element.checked)}});
    if(element.checked)
      this.seleccionados =  this.dataSource.map(data => { return data.idInscripcion});
    else
      this.seleccionados = [];
  }
  
  
  
  seleccionarFila(evento: Event) {
    let element = evento.target as HTMLInputElement;
    if(element.checked)
      this.seleccionados.push(parseInt(element.value))
    else
      this.seleccionados = this.seleccionados.filter(item => item != parseInt(element.value));
  
  }
  
  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.loadData();
  }

  imprimirLista(){
    this.waitDownload = true;
    this.reporteService.exportListAsistenciasRapidas(this.getPayloadList()).subscribe((data)=>{

      this.notificationService.success('Se esta descargando el reporte');
      const blob: Blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Reporte_Asistencia_Rapida_Del_Tallerista.xlsx');
      this.waitDownload = false;
    })
  }
}
