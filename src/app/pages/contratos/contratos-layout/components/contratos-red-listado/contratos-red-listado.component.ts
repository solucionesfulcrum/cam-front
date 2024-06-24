import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Parametro } from '@models/parametros-busqueda.model';
import { NotificationService } from '@services/notification.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { imprimirRequestCam, listaConstactosRequest, listaContratosRedRequest } from '@models/afiliados/ficha-solicitud.model';
import { PageEvent } from '@angular/material/paginator';
import { ParamMenu } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ContratosAdministracionService } from 'src/app/data/services/contratos/contratos-administracion.service';



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
    frmSearchCam:new FormControl(""),
  });

  
  faSpinner = faSpinner;

  dataAcciones: ParamMenu[] = [
    {texto: 'Descargar Excel', svgDir: 'assets/svg/icon-excel.svg'}
  ];
  opciones: Parametro[] = [];
  opciones_cam: Parametro[] = [];
  dataSource: any[] = [];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;
  columns: string[] = ['marcar','numOc', 'fechaContrato', 'tallerista','monto', 'periodo_contrato','desCam', 'fecha'];

  loadingData: boolean = false;

  constructor(private fb                      : FormBuilder, 
              private dialog                  : Dialog,
              private notificationService     : NotificationService,
              private datosService            : DatosGeneralesService,
              private afiliacionesService     : AfiliacionesSolicitudesService,
              private contrato                : ContratosAdministracionService
            ) { }

  ngOnInit(): void {
    this.datosService.getTipoParametros('ESTADO_CONTRATO').subscribe((data)=>{
      this.opciones = data.data.map(e=>{
        return {...e, valor1: String(e.idParametros)}
      });
    });

    this.datosService.getCams(JSON.parse(localStorage.getItem("UnidElegida")!).idUnidOperativa).subscribe((data)=>{
      this.opciones_cam = data.data.map((e : any)=>{ //No había más solución
        return {...e, idParametros: e.codigo} as Parametro
      });
    });
  }

  onLoadData(){
    setTimeout(()=>{
        this.loadingData = true;
        this.contrato.contratoListarRed(this.getContactos()).subscribe((data)=>{
        this.loadingData = false;
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

  getContactos(): listaContratosRedRequest{
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
    // //console.log(this.formBuscar.get('frmSearchEstado')?.value)
    return {
      idUnidOpe: idUnidOpe.idUnidOperativa,
      texto: this.formBuscar.controls['frmSearch'].value,
      fecInicio: fecInicio,
      fecFin: fecFin,
      pageNum: this.pageNum.toString(),
      pageSize: this.pageSize.toString(),
      codigoCam: this.formBuscar.get('frmSearchCam')?.value,
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
    let payload: imprimirRequestCam = {
      idUnidOpe: idUnidOpe.idUnidOperativa,
      texto: this.formBuscar.controls['frmSearch'].value,
      estado: parseInt(this.formBuscar.get('frmSearchEstado')?.value),
      codigoCam: String(this.formBuscar.get('frmSearchCam')?.value),
      fecInicio: fecInicio,
      fecFin: fecFin
    };

    this.contrato.getExcelContratadosRed(payload).subscribe((data)=>{
      this.notificationService.success('Se esta descargando el reporte');
      const blob: Blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = 'Reporte_Contratos_Red.xlsx';
      anchor.href = url;
      anchor.click();
      window.URL.revokeObjectURL(url);
    })
  }

  firstDisplayValue(value: any){
    value = value == "null" ? "" : value;
    this.formBuscar.get('frmSearchCam')?.setValue(value);
    this.onLoadData();
  }

  secDisplayValue(value: any){
    this.formBuscar.get('frmSearchEstado')?.setValue(value);
    this.onLoadData();
  }
}
