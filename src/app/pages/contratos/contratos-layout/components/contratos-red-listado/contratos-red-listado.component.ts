import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Parametro } from '@models/parametros-busqueda.model';
import { NotificationService } from '@services/notification.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { imprimirRequest, listaConstactosRequest } from '@models/afiliados/ficha-solicitud.model';
import { PageEvent } from '@angular/material/paginator';
import { ParamMenu } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'esp-contratos-red-listado',
  templateUrl: './contratos-red-listado.component.html',
  styleUrls: ['./contratos-red-listado.component.scss']
})
export class ContratosRedListadoComponent {
  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
  });

  
  faSpinner = faSpinner;

  dataAcciones: ParamMenu[] = [
    {texto: 'Descargar Excel', svgDir: 'assets/svg/icon-excel.svg'}
  ];
  opciones: Parametro[] = [];
  dataSource: any[] = [];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;
  columns: string[] = ['marcar','nombres','tipoDoc','numDoc', 'edad', 'estadoCivil','ipress','hasta','fecha'];

  constructor(private fb                      : FormBuilder, 
              private dialog                  : Dialog,
              private notificationService     : NotificationService,
              private datosService            : DatosGeneralesService,
              private afiliacionesService     : AfiliacionesSolicitudesService,) { }

  ngOnInit(): void {
    this.datosService.getTipoParametros('ESTADO_FICHA_ADMISION').subscribe((data)=>{
      this.opciones = data.data;
    });
  }

  onLoadData(){
    this.afiliacionesService.getListaContacto(this.getContactos()).subscribe((data)=>{
      if (data.code == 0) {
      this.dataSource = data.data.list;
      this.pageNum = data.data.pageNum;
      this.pageSize = data.data.pageSize;
      this.total = data.data.total;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }
  
  getDataFecha(value: any){
    this.formBuscar.get('frmSearchDate')?.setValue(value);
    this.onLoadData();
  }

  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.onLoadData();
  }

  getContactos(): listaConstactosRequest{
    var fecInicio: any;
    var fecFin: any;
    var idUnidOpe = JSON.parse(localStorage.getItem("UnidElegida")!);

    if (this.formBuscar.value.frmSearchDate == '') {
      fecInicio = `${new Date().getFullYear()}-1-1`;
      fecFin = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
    }
    else{
      var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
      var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
      fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
      fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;
    }
    // console.log(this.formBuscar.get('frmSearchEstado')?.value)
    return {
      idUnidOpe: idUnidOpe.idUnidOperativa,
      texto: this.formBuscar.controls['frmSearch'].value,
      fecInicio: fecInicio,
      fecFin: fecFin,
      pageNum: this.pageNum.toString(),
      pageSize: this.pageSize.toString(),
      estado: this.formBuscar.get('frmSearchEstado')?.value
    }
  }

  imprimirLista(){
    var fecInicio: any;
    var fecFin: any;
    var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
    var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
    fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
    fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;
    var idUnidOpe = JSON.parse(localStorage.getItem("UnidElegida")!);
    let payload: imprimirRequest = {
      idUnidOpe: idUnidOpe.idUnidOperativa,
      texto: this.formBuscar.controls['frmSearch'].value,
      estado: parseInt(this.formBuscar.get('frmSearchEstado')?.value),
      fecInicio: fecInicio,
      fecFin: fecFin
    };

    this.afiliacionesService.getExcelAsegurados(payload).subscribe((data)=>{
      this.notificationService.success('Se esta descargando el reporte');
      const blob: Blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = 'Reporte_Asegurados.xlsx';
      anchor.href = url;
      anchor.click();
      window.URL.revokeObjectURL(url);
    })
  }

  firstDisplayValue(value: any){
    this.formBuscar.get('frmSearchEstado')?.setValue(value);
    this.onLoadData();
  }
}
