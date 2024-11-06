import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RequestAdminAseguradosCam, RequestAdminAseguradosCamExcel } from '@models/adm-uo/adm-uo';
import { listaContratosRedRequest, imprimirRequestCam } from '@models/afiliados/ficha-solicitud.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { NotificationService } from '@services/notification.service';
import { ParamMenu } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ReportesService } from 'src/app/data/services/reportes/reportes.service';
import { ExcelExportService } from 'src/app/data/services/utils/ExcelExportService';

@Component({
  selector: 'esp-asegurados',
  templateUrl: './asegurados.component.html',
  styleUrls: ['./asegurados.component.scss']
})
export class AseguradosComponent {
  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
    frmSearchCam:new FormControl(""),
    frmSearchRed:new FormControl(""),
  });

  progressValue: number = 0;
  statusLoadingExcel : boolean = false;

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
  columns: string[] = ['marcar','nombres', 'tipoDoc','numDoc', 'fecRegistro', 'fecNacimiento', 'edad', 'estadoCivil','ipress','fecha'];

  rol: string = '';

  seleccionados: number[] = [];

  loadingData: boolean = false;

  isCreatingExcel: boolean = false; // Indica si está creando el Excel
  
  opciones_cam: Parametro[] = [];
  opciones_red: Parametro[] = [];

  constructor(private fb                      : FormBuilder, 
              private dialog                  : Dialog,
              private notificationService     : NotificationService,
              private reportesService         : ReportesService,
              private datosService            : DatosGeneralesService,
              private afiliacionesService     : AfiliacionesSolicitudesService,
              private excelExportService: ExcelExportService,) { }

  ngOnInit(): void {
    this.datosService.getTipoParametros('ESTADO_FICHA_ADMISION').subscribe((data)=>{
      this.opciones = data.data;
    });

    this.datosService.getAllCams().subscribe((data)=>{
      this.opciones_cam = data.data.map((e: any) => {
        return { ...e, valor1: e.codigo } as Parametro;
      }).sort((a: any, b: any) => {
        if (a.nombre < b.nombre) {
          return -1;
        }
        if (a.nombre > b.nombre) {
          return 1;
        }
        return 0;
      });
    
      this.onLoadData();
    });

    this.datosService.getReds().subscribe((data)=>{
      this.opciones_red = data.data.map((e : any)=>{ //No había más solución
        return {...e, valor1: e.idUnidadOperativa} as Parametro
      });
    });

    this.onLoadData();
  }

  onProgressExcel() {
    if (this.progressValue < 100) {
      this.reportesService.getPorcentajeProgress('NACIONAL').subscribe((data)=>{
        this.progressValue = data;
        setTimeout(()=>{
          this.onProgressExcel();
        }, 200)
      })
    }
  }

  onLoadData(){

    setTimeout(()=>{
      //this.rol = JSON.parse(localStorage.getItem('UnidElegida')!).rol;
    
      //DEFINIENDO CUAL SERVICIO USAR
      let servicioMetodo = this.afiliacionesService.getListaContactoAdmin(this.getContactos());
     
  
      this.loadingData = true;
  
      servicioMetodo.subscribe((data)=>{
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

  getAllDataForExcel() {
    this.statusLoadingExcel = true;
    this.progressValue = 0;

    // Simular el progreso de "Cargando data"
    setTimeout(() => {
      this.progressValue = 25;
    }, 500);

    const servicioMetodo = this.afiliacionesService.getListaContactoAdminForExcel(this.getContactosAll());

    servicioMetodo.subscribe(
      (response) => {
        this.progressValue = 50;
        const list = response.data;

        if (list && list.length > 0) {
          const headers: { [key: string]: string } = Object.keys(list[0]).reduce((acc, key) => {
            acc[key] = key;
            return acc;
          }, {} as { [key: string]: string });

          // Cambiar estado a "Creando Excel" y reiniciar el progreso
          this.isCreatingExcel = true;
          this.progressValue = 0; // Reiniciar el progreso

          // Simular el progreso de creación del Excel
          const interval = setInterval(() => {
            if (this.progressValue < 100) {
              this.progressValue += 10; // Incrementar el progreso en cada intervalo
            } else {
              clearInterval(interval); // Detener el intervalo cuando llega al 100%
              this.exportExcel(list, headers);
            }
          }, 300); // Ajustar el tiempo del intervalo según la duración deseada
        }
      },
      (error) => {
        // Manejo de errores
        this.statusLoadingExcel = false;
        this.isCreatingExcel = false;
        console.error('Error al obtener datos:', error);
      }
    );
  }

  getDataForExcel(){
    let servicioMetodo = this.afiliacionesService.getListaContactoAdmin(this.getContactos());
     
    this.loadingData = true;

    servicioMetodo.subscribe((data)=>{
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
  }

  exportExcel(data: any[], headers: { [key: string]: string }) {
    this.excelExportService.exportToExcel(data, headers, 'DatosExportados');
    this.progressValue = 100;

    setTimeout(() => {
      this.statusLoadingExcel = false;
      this.isCreatingExcel = false;
      this.progressValue = 0;
    }, 1000); // Tiempo opcional para ocultar el estado de carga después de la exportación
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

  getContactos(): RequestAdminAseguradosCam{
    var fecInicio: any;
    var fecFin: any;

    if (this.formBuscar.value.frmSearchDate == '') {
      //fecInicio = `${new Date().getFullYear()}-1-1`;
      fecInicio = `2020-1-1`;
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
      idUnidOpe: this.formBuscar.get('frmSearchRed')?.value,
      texto: this.formBuscar.controls['frmSearch'].value,
      fecInicio: fecInicio,
      fecFin: fecFin,
      pageNum: this.pageNum.toString(),
      pageSize: this.pageSize.toString(),
      estado: this.formBuscar.get('frmSearchEstado')?.value,
      codigoCam : this.formBuscar.get('frmSearchCam')?.value
    }
  }

  getContactosAll(): RequestAdminAseguradosCamExcel {
    var fecInicio: any;
    var fecFin: any;

    if (this.formBuscar.value.frmSearchDate == '') {
      //fecInicio = `${new Date().getFullYear()}-1-1`;
      fecInicio = `2020-1-1`;
      fecFin = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
    }
    else{
      var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
      var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
      fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
      fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;
    }
    
    return {
      idUnidOpe: this.formBuscar.get('frmSearchRed')?.value,
      texto: this.formBuscar.controls['frmSearch'].value,
      fecInicio: fecInicio,
      fecFin: fecFin,  // Fecha actual
      estado:  this.formBuscar.get('frmSearchEstado')?.value,
      codigoCam:  this.formBuscar.get('frmSearchCam')?.value
    }
}



  imprimirLista(){
    var fecInicio: any;
    var fecFin: any;

    if (this.formBuscar.value.frmSearchDate == '') {
      //fecInicio = `${new Date().getFullYear()}-1-1`;
      fecInicio = `2020-1-1`;
      fecFin = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
    }
    else{
      var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
      var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
      fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
      fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;
    }

    /*
    var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
    var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
    fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
    fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;
    var idUnidOpe = JSON.parse(localStorage.getItem("UnidElegida")!);*/

    let payload: RequestAdminAseguradosCam = {
      idUnidOpe: this.formBuscar.get('frmSearchRed')?.value,
      texto: this.formBuscar.controls['frmSearch'].value,
      estado: parseInt(this.formBuscar.get('frmSearchEstado')?.value),
      fecInicio: fecInicio,
      fecFin: fecFin,
      codigoCam : this.formBuscar.get('frmSearchCam')?.value
    };

    let servicioMetodo = this.afiliacionesService.getExcelAseguradosAdmin(payload);
    this.progressValue = 0;
    this.statusLoadingExcel = true;
    setTimeout(() =>{
      
    this.onProgressExcel();
    })


    servicioMetodo.subscribe((data)=>{
      this.notificationService.success('Se esta descargando el reporte');
      const blob: Blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = 'Reporte_Asegurados.xlsx';
      anchor.href = url;
      anchor.click();
      this.progressValue = 0;
      this.statusLoadingExcel = false;
      window.URL.revokeObjectURL(url);
    }, error =>{
      this.statusLoadingExcel = false;
      this.progressValue = 0;
    })
  }

  firstDisplayValue(value: any){
    this.formBuscar.get('frmSearchEstado')?.setValue(value);
    this.onLoadData();
  }

  
  secDisplayValue(value: any){
    this.formBuscar.get('frmSearchCam')?.setValue(value == "null" ? "" : value);
    this.onLoadData();
  }

  thirdDisplayValue(value: any){
    let valueRed = value == "null" ? "" : value;
    this.formBuscar.get('frmSearchRed')?.setValue(valueRed);
    if(valueRed != ""){
      this.datosService.getCams(valueRed).subscribe((data)=>{
        this.opciones_cam = data.data.map((e: any) => {
          return { ...e, valor1: e.codigo } as Parametro;
        }).sort((a: any, b: any) => {
          if (a.nombre < b.nombre) {
            return -1;
          }
          if (a.nombre > b.nombre) {
            return 1;
          }
          return 0;
        });
      
        this.onLoadData();
      });
    }
    else{
      setTimeout(()=>{
        this.formBuscar.get('frmSearchCam')?.setValue("");
        this.formBuscar.get('frmSearchRed')?.setValue("");
        //this.opciones_cam = [];
        this.datosService.getAllCams().subscribe((data)=>{
          this.opciones_cam = data.data.map((e: any) => {
            return { ...e, valor1: e.codigo } as Parametro;
          }).sort((a: any, b: any) => {
            if (a.nombre < b.nombre) {
              return -1;
            }
            if (a.nombre > b.nombre) {
              return 1;
            }
            return 0;
          });
        
          this.onLoadData();
        });
      })
    }
    
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

}
