import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { imprimirRequestCam } from '@models/afiliados/ficha-solicitud.model';
import { RequestListTallerista, RequestListTalleristaRed } from '@models/contactos/talleristas/contactos-talleristas.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { NotificationService } from '@services/notification.service';
import { ParamMenu } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import { ContactosTalleristasService } from 'src/app/data/services/contactos/contactos-talleristas.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'app-contactos-talleristas',
  templateUrl: './contactos-talleristas.component.html',
  styleUrls: ['./contactos-talleristas.component.css']
})
export class ContactosTalleristasComponent implements OnInit {

  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchEstado:new FormControl(),
    frmSearchAccion:new FormControl(),
    frmSearchCam:new FormControl(""),
  });
  columns: string[] = ['marcar','nombres','tipoDoc','numDoc', 'telefono', 'correo','perfil'];

  dataAcciones: ParamMenu[] = [
    {texto: 'Descargar Excel', svgDir: 'assets/svg/icon-excel.svg'}
  ];
  
  dataSource: any[] = [];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;

  opciones_cam: Parametro[] = [];
  opciones: Parametro[] = [];

  loadingData: boolean = false;
  faSpinner = faSpinner;

  rol: string = '';

  seleccionados: number[] = [];
  
  constructor(private fb                                    : FormBuilder,
              private talleristaService                     : ContactosTalleristasService,
              private notificationService                   : NotificationService,
              private datosService            : DatosGeneralesService,) { }

  ngOnInit(): void {
    this.onLoadData();

    this.datosService.getTipoParametros('ESTADO_FICHA_ADMISION').subscribe((data)=>{
      this.opciones = data.data.map(opcion=> { return {...opcion, valor1: String(opcion.idParametros)}});
    });

    
    this.datosService.getCams(JSON.parse(localStorage.getItem("UnidElegida")!).idUnidOperativa).subscribe((data)=>{
      this.opciones_cam = data.data.map((e : any)=>{ //No había más solución
        return {...e, idParametros: e.codigo} as Parametro
      });
    });
    
  }

  onLoadData(){


    setTimeout(()=>{
      this.rol = JSON.parse(localStorage.getItem('UnidElegida')!).rol;

      let servicioMetodo = this.rol == 'COORDINADOR RED' ? 
      this.talleristaService.getTalleristaListRed(this.getPayloadList()) :
      this.talleristaService.getTalleristaList(this.getPayloadList());
  
      this.loadingData = true;
  
      servicioMetodo.subscribe((data)=>{
        this.loadingData = false;
        if (data.code == 0) {
          console.log(data.data.list)
          this.dataSource = data.data.list;
          this.pageNum = data.data.pageNum;
          this.pageSize = data.data.pageSize;
          this.total = data.data.total;
        }
        else {
          this.notificationService.warning(data.message);
        }
      })
    })
    
   
  }

  getPayloadList(): RequestListTalleristaRed{
    return {
      idUnidOpe: JSON.parse(localStorage.getItem("UnidElegida")!).idUnidOperativa,
      texto: this.formBuscar.controls['frmSearch'].value,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      estado: this.formBuscar.get('frmSearchEstado')?.value,
      codigoCam : this.formBuscar.get('frmSearchCam')?.value
    }
  }

  imprimirLista(){
    var idUnidOpe = JSON.parse(localStorage.getItem("UnidElegida")!);

    let payload: imprimirRequestCam = {
      idUnidOpe: idUnidOpe.idUnidOperativa,
      texto: this.formBuscar.controls['frmSearch'].value,
      estado: parseInt(this.formBuscar.get('frmSearchEstado')?.value),
      fecInicio: '',
      fecFin: '',
      codigoCam : this.formBuscar.get('frmSearchCam')?.value
    };

    this.talleristaService.getExcelTalleristas(payload).subscribe((data)=>{
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
  
  handlePageEvent(event: PageEvent) {
    // console.log(this.pageSizeOptions);
    console.log(event)
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.onLoadData();
  }

    
  firstDisplayValue(value: any){
    this.formBuscar.get('frmSearchEstado')?.setValue(value);
    this.onLoadData();
  }

  
  secDisplayValue(value: any){
    this.formBuscar.get('frmSearchCam')?.setValue(value == "null" ? "" : value);
    this.onLoadData();
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
