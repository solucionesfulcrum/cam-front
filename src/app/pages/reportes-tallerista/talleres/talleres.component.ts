import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { imprimirRequestCam } from '@models/afiliados/ficha-solicitud.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { ProgramacionRequestListContratos } from '@models/programacion/programacion-contratos/programacion-contrato-lista.model';
import { ReportesTalleristaPayload } from '@models/reportes/reportes-tallerista';
import { NotificationService } from '@services/notification.service';
import { ParamMenu } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ProgramacionContratosService } from 'src/app/data/services/programacion/programacion-contratos.service';
import { ReportesTalleristaService } from 'src/app/data/services/reportes/reportes-tallerista.service';

@Component({
  selector: 'esp-talleres',
  templateUrl: './talleres.component.html',
  styleUrls: ['./talleres.component.scss']
})
export class TalleresComponent {
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
    'nombreTaller',
    'tipo',
    'fechaTaller',
    'horaInicio', 
    'horaFin', 
    'numeroSesiones',
    'estado',
  ];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;

  loadingData : boolean = false;
  
  constructor(private fb                      : FormBuilder,
    private programacionService     : ProgramacionContratosService,
    private datosService             : DatosGeneralesService,
    private notificationService     : NotificationService,
    private reportService : ReportesTalleristaService
) { }

ngOnInit(){
  this.datosService.getTipoParametros('ESTADO_CONTROL_ASISTENCIA').subscribe((data)=>{
    if (data.code == 0) {
      this.opciones = data.data;
    }
    else{
      this.notificationService.warning(data.message);
    }
  });
}

loadData(){

  setTimeout(() => {
    this.loadingData = true;
    this.reportService.getDataReporteTalleristas(this.getPayloadList()).subscribe((data)=>{
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
  var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
  var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
  fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
  fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;

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




  
}
