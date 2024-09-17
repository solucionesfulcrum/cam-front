import { Dialog } from '@angular/cdk/dialog';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { RequestListaSAfiliadosContacto,imprimirRequest,imprimirRequestCam,listaConstactosRequest, listaContratosRedRequest } from '@models/afiliados/ficha-solicitud.model';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { DialogNewAseguradoComponent } from './sub-components/dialog/dialog-new-asegurado/dialog-new-asegurado.component';
import { NotificationService } from '@services/notification.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { Parametro } from '@models/parametros-busqueda.model';
import { ParamMenu } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ModalEditarComponent } from 'src/app/pages/control/components/sub-components/dialogs/modal-editar/modal-editar.component';
import { ModalConfirmarComponent } from 'src/app/pages/control/components/sub-components/dialogs/modal-confirmar/modal-confirmar.component';
import { MatDialog } from '@angular/material/dialog';
import { AgregarACiramComponent } from './sub-components/dialog/agregar-a-ciram/agregar-a-ciram.component';
import { ToastrService } from 'ngx-toastr';
import { ModalConfirmarGenericoComponent } from '@shared/components/modal-confirmar-generico/modal-confirmar-generico.component';

@Component({
  selector: 'app-contactos-afiliados',
  templateUrl: './contactos-afiliados.component.html',
  styleUrls: ['./contactos-afiliados.component.scss']
})
export class ContactosAfiliadosComponent implements OnInit {
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
  dataSource: any[] = [];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;
 // columns: string[] = ['marcar','nombres','tipoDoc','numDoc', 'edad', 'estadoCivil','ipress', 'ciram', 'fecha'];
   columns: string[] = ['marcar','nombres','tipoDoc','numDoc', 'edad', 'estadoCivil','ipress', 'fecha'];

  rol: string = '';

  seleccionados: number[] = [];
  loadingData: boolean = false;
  dropdownOpen: boolean = false;
  ciramSelected: boolean = false;
  sinAsignarCiramSelected: boolean = false;

  
  opciones_cam: Parametro[] = [];

  constructor(private fb                      : FormBuilder, 
              private dialog                  : MatDialog,
              private notificationService     : NotificationService,
              private datosService            : DatosGeneralesService,
              private afiliacionesService     : AfiliacionesSolicitudesService,
              private toast: ToastrService
            ) { }

  ngOnInit(): void {
    this.datosService.getTipoParametros('ESTADO_FICHA_ADMISION').subscribe((data)=>{
      this.opciones = data.data;
    });

    this.datosService.getCams(JSON.parse(localStorage.getItem("UnidElegida")!).idUnidOperativa).subscribe((data)=>{
      this.opciones_cam = data.data.map((e : any)=>{ //No había más solución
        return {...e, valor1: e.codigo} as Parametro
      });
    });
    this.onLoadData();
  }

  onLoadData(){

    setTimeout(()=>{
      this.rol = JSON.parse(localStorage.getItem('UnidElegida')!).rol;
    
      //DEFINIENDO CUAL SERVICIO USAR
      let servicioMetodo = this.rol == 'COORDINADOR RED' ? 
      this.afiliacionesService.getListaContactoRed(this.getContactos()) :
      this.afiliacionesService.getListaContacto(this.getContactos());
  
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
      idUnidOpe: idUnidOpe.idUnidOperativa,
      texto: this.formBuscar.controls['frmSearch'].value,
      fecInicio: fecInicio,
      fecFin: fecFin,
      pageNum: this.pageNum.toString(),
      pageSize: this.pageSize.toString(),
      estado: this.formBuscar.get('frmSearchEstado')?.value,
      codigoCam : this.formBuscar.get('frmSearchCam')?.value
    }
  }

  imprimirLista(){
    var fecInicio: any;
    var fecFin: any;
    //var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
    //var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
    //fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
    //fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;

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
    var idUnidOpe = JSON.parse(localStorage.getItem("UnidElegida")!);

    let payload: imprimirRequestCam = {
      idUnidOpe: idUnidOpe.idUnidOperativa,
      texto: this.formBuscar.controls['frmSearch'].value,
      estado: parseInt(this.formBuscar.get('frmSearchEstado')?.value),
      fecInicio: fecInicio,
      fecFin: fecFin,
      codigoCam : this.formBuscar.get('frmSearchCam')?.value
    };

    let servicioMetodo = this.rol == 'COORDINADOR RED' ? 
    this.afiliacionesService.getExcelAseguradosRed(payload) :
    this.afiliacionesService.getExcelAsegurados(payload);
    
    servicioMetodo.subscribe((data)=>{
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

  
  secDisplayValue(value: any){
    this.formBuscar.get('frmSearchCam')?.setValue(value == "null" ? "" : value);
    this.onLoadData();
  }

  afectarTodo(evento: Event): void{
    let element = evento.target as HTMLInputElement;
    this.dataSource = this.dataSource.map(data => { return {...data, marcar: Boolean(element.checked)}});
    if(element.checked)
      this.seleccionados =  this.dataSource.filter(data => data.estado == 'ACTIVO').map(data => { return data.id});
    else
      this.seleccionados = [];
  }
  
  
  
  seleccionarFila(evento: Event) {
    let element = evento.target as HTMLInputElement;
    if(element.checked)
      this.seleccionados.push(parseInt(element.value))
    else
      this.seleccionados = this.seleccionados.filter(item => item != parseInt(element.value));

    this.ciramSelected = this.dataSource.filter(data => data.estado == 'ACTIVO' && data.nomCiram).filter(data => { 
      return this.seleccionados.indexOf(data.id) > -1
    }).length > 0;

    this.sinAsignarCiramSelected = this.dataSource.filter(data => data.estado == 'ACTIVO' && !data.nomCiram).filter(data => { 
      return this.seleccionados.indexOf(data.id) > -1
    }).length > 0;
    
  }

  editaSeleccionado(evento : Event) : void{
    evento.preventDefault();
    const dialog = this.dialog.open(AgregarACiramComponent,{
      width: "30%"
    }).afterClosed().subscribe(data=>{
      if(data.idUnidadOperativa){
        this.afiliacionesService.asignarACiram(data.idUnidadOperativa, this.seleccionados).subscribe(data=>{
          if(data.code == 0){
            this.toast.success(data.message);
            this.seleccionados = [];
            this.onLoadData();
          }
          else{
            this.toast.warning(data.message);
          }
        })
      }
    });

  }

  eliminaSeleccionados(evento : Event) : void{
    const dialog = this.dialog.open(ModalConfirmarGenericoComponent,{
      width: "30%",
      data:{
        message: "¿Desea desvincular a los afiliados seleccionados del CIRAM actual?"
      }
    });

    dialog.afterClosed().subscribe((result : {success: boolean}) => {
      if(result.success){
        this.afiliacionesService.quitarDeCiram(this.seleccionados).subscribe(data=>{
          if(data.code == 0){
            this.toast.success(data.message);
            this.seleccionados = [];
            this.onLoadData();
          }
          else{
            this.toast.warning(data.message);
          }
        })
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container, .checkbox-select')) {
      this.dropdownOpen = false; // Cierra el dropdown si se hace clic fuera de él
    }
  }

}
