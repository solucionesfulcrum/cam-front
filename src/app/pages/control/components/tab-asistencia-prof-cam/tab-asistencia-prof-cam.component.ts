import { ChangeDetectorRef, Component, HostListener, Inject, LOCALE_ID } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { faArrowsUpToLine, faIcons, faSpinner } from '@fortawesome/free-solid-svg-icons';
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
import { Toast, ToastrService } from 'ngx-toastr';
import { ModalConfirmarComponent } from '../sub-components/dialogs/modal-confirmar/modal-confirmar.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditarComponent } from '../sub-components/dialogs/modal-editar/modal-editar.component';
import { ModalAlertComponent } from '@shared/components/modal-alert/modal-alert.component';

@Component({
  selector: 'esp-tab-asistencia-prof-cam',
  templateUrl: './tab-asistencia-prof-cam.component.html',
  styleUrls: ['./tab-asistencia-prof-cam.component.scss']
})
export class TabAsistenciaProfCamComponent {

  svgDir = faArrowsUpToLine;
  
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
    frmDoc: ['', [Validators.required]],
  });

  esperaBusqueda: boolean = true;

  dataSourceList = new DataSourceList();

  seleccionados : number[] = [];

  dropdownOpen: boolean = false;
  chkHeader: boolean = false;


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
              private dialog                            : MatDialog,
              private toast                             : ToastrService,
              private cdr: ChangeDetectorRef,
              
              private controlProgramacionService : ControlProgramacionService
              ) { }

  ngOnInit(){

    this.formBuscarPersona.get('frmSelectDoc')!.valueChanges.subscribe(value => {
      this.formBuscarPersona.get('frmDoc')?.setValue("");
      this.setDocumentValidators(value!);
    })

    
    this.getDataCabecera();
    this.getParametros();
    this.getListAsegurados();
    this.setListeners();
  }

  getParametros(){
    this.datosService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data) =>{
      this.opciones = data.data;
      this.getListTablaAsegurados();
    });
  }

  setListeners(){
    this.ctrlSearch.valueChanges.subscribe((data)=>{
      if (typeof data !== 'object') {
        this.listFilteredBusqueda = this.listBusqueda.filter((item)=> item.nombreCompleto.toLowerCase().includes(data!.toLowerCase()) || item.numDoc.includes(data));
      }
    })
  }

  
 

  getDataCabecera(){
    this.controlService.getCabeceraProgramacion(JSON.parse(localStorage.getItem('idProgramElegida')!)).subscribe((data)=>{
      if (data.code == 0) {
        this.datoProgramacion = data.data;
        ////console.log(this.datoProgramacion)
        let seconds = Math.floor((new Date(this.datoProgramacion.fechaServicio + ' ' + this.datoProgramacion.horaFin).getTime() - new Date(this.datoProgramacion.fechaServicio + ' ' + this.datoProgramacion.horaInicio).getTime())/1000);
        let horas = Math.floor(seconds/(60*60));
        let minutos = Math.floor(seconds/60) - horas*60;
        this.datoProgramacion.margenHorario = horas + 'h ' +  minutos + ' m';
        ////console.log(Math.floor(seconds/(60*60)) + 'h ' +  Math.floor(seconds/60) + ' m')
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
    // //console.log(this.pageSizeOptions);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    //this.onLoadData();
  }

  afectarTodo(evento: Event): void{
    let element = evento.target as HTMLInputElement;
    this.dataSource = this.dataSource.map(data => { return {...data, marcar: Boolean(element.checked)}});
    if(element.checked)
      this.seleccionados =  this.dataSource.map(data => { return data.idInscripcion});
    else
      this.seleccionados = [];
  }

  getListTablaAsegurados() : void{
    this.controlService.listarAsistencia({
      idProgDet: String(JSON.parse(localStorage.getItem('idProgramElegida')!)),
      pageSize: 5,
      pageNum: 1
    })
    .subscribe(data => {
      let dataAsistentes = (data.data as AsistenciaLista[]).map((asistente : AsistenciaLista, index: number)=>{
  
        return {...asistente, 
          orden: index + 1, 
          marcar: false,
          tipoDoc : this.opciones.filter(e=>e.valor1 == asistente.tipoDoc)[0].nombre
        }
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
    let payload: RequestBuscarApto = {
      idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      tipDoc: event.option.value.tipoDoc === 'DNI' ? '1' : '4',
      numDoc: event.option.value.numDoc
    }
    this.controlService.getSiEsApto(payload).subscribe((data)=>{
      if ((data.code == 0 || data.code == 2) && data.data) {
        let conexion: boolean;
        if (data.code == 2) {
          conexion = false;
        }
        else{
          conexion = true;
        }
        if (!data.data[0].acreditacion) {
          this.notificacionService.warning(data.message);
        }

        let unidadOperativa : string = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;
        let selectedProgramacion : string = String(localStorage.getItem('idProgramElegida'));
        this.controlProgramacionService.registrarInscripcion({
          idFichaAdmision: data.data[0].idFichaAsegurado,
          idUnidadOperativa: unidadOperativa,
          idProgramacionDet: selectedProgramacion,
          acreditado: data.data[0].acreditacion,
          idUsuarioReg: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario,
          conConexion: conexion
        }).subscribe(data => {
          if(data.code == "0"){
            this.getListTablaAsegurados();
          }
          else{
            this.toast.warning(data.message);
          }
        })
      }
      else{
        //this.notificacionService.info(data.message);
        this.dialog.open(ModalAlertComponent, {
          width: '20%',
          height: '300px',
          data: {
            mensaje: data.message
          }
        })
      }
      this.esperaBusqueda = false;
    })

    this.ctrlSearch.setValue('');
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
        ////console.log(data.data);
        const dialogRef = this.dialog.open(DialogConfirmDataAsistenciaComponent,{
          minWidth:'850px',
          maxWidth:'50%',
          data:{
            infoAsegurado: data.data[0],
          }
        })
        dialogRef.afterClosed().subscribe((result : any) => {
          ////console.log(result);
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

  seleccionarFila(evento: Event) {
    let element = evento.target as HTMLInputElement;
    if(element.checked)
      this.seleccionados.push(parseInt(element.value))
    else
      this.seleccionados = this.seleccionados.filter(item => item != parseInt(element.value));

  }

  eliminarAsegurados(){
    let asistentesEliminar: number[] = this.dataSource
    .filter((asistente: AsistenciaLista) => this.seleccionados.includes(asistente.idInscripcion))
    .map((asistente: AsistenciaLista) => asistente.idInscripcion as number);

    ////console.log(asistentesEliminar);
    this.controlService.eliminarRegistrados(asistentesEliminar).subscribe(data=>{
      if(data.code == 0){
        this.toast.success("Los registros han sido eliminados");
        this.getListTablaAsegurados();
        this.seleccionados = [];
      }
      else{
        this.toast.error("Ocurrió un error eliminando los registros");
      }
    })
  }

  getListAsegurados(){
    this.esperaBusqueda = true;
    this.controlService.getListAsegurados().subscribe((data)=>{
      this.esperaBusqueda = false;
      if (data.code == 0) {
        this.listBusqueda = data.data;
        this.ctrlSearch.setValue('');
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onOptionSelected(option: number) {
    //console.log('Opción seleccionada:', option);
    // Realiza la acción deseada con la opción seleccionada
    this.dropdownOpen = false; // Cierra el dropdown después de seleccionar una opción
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container, .checkbox-select')) {
      this.dropdownOpen = false; // Cierra el dropdown si se hace clic fuera de él
    }
  }

  editaSeleccionado(evento : Event) : void{
    evento.preventDefault();
    const dialog = this.dialog.open(ModalEditarComponent,{
      width: "30%"
    });

  }

  eliminaSeleccionados(evento : Event) : void{
    const dialog = this.dialog.open(ModalConfirmarComponent,{
      width: "30%"
    });

    dialog.afterClosed().subscribe((result : {success: boolean}) => {
      if(result.success){
        this.eliminarAsegurados();
      }
    });
  }

  setDocumentValidators(documentType: string) {
    const documentNumberControl = this.formBuscarPersona.get('frmDoc')!;
    if (documentType === '1') {
      documentNumberControl.setValidators([
        Validators.required,
        Validators.pattern(/^\d{8}$/)
      ]);
    } else if (documentType === '4') {
      documentNumberControl.setValidators([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]{9}$/)
      ]);
    }
    else if (documentType === '23') { // Suponiendo que 'X' es el tipo de documento para el permiso temporal de permanencia
    documentNumberControl.setValidators([
      Validators.required,
      Validators.pattern(/^\d{9}$/) // Ajusta el patrón según el formato del permiso temporal de permanencia
    ]);
  } else if (documentType === '7') { // Suponiendo que 'P' es el tipo de documento para el pasaporte
    documentNumberControl.setValidators([
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9]{9}$/) // Ajusta el patrón según el formato del pasaporte
    ]);
  }
    else {
      documentNumberControl.setValidators(Validators.required);
    }
    documentNumberControl.updateValueAndValidity();
  }

  onAseguradoSelectCodigoBarra(event: any) : void{
    if(!this.formBuscarPersona.get("frmDoc")?.valid){
      return ;
    }
    let payload: RequestBuscarApto = {
      idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      tipDoc:  String(this.formBuscarPersona.get("frmSelectDoc")?.value),
      numDoc: String(this.formBuscarPersona.get("frmDoc")?.value)
    }
    this.controlService.getSiEsApto(payload).subscribe((data)=>{
      if ((data.code == 0 || data.code == 2) && data.data.length > 0) {
        let conexion: boolean;
        if (data.code == 2) {
          conexion = false;
        }
        else{
          conexion = true;
        }
        if (!data.data[0].acreditacion) {
          this.notificacionService.warning(data.message);
        }

        let unidadOperativa : string = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;
        let selectedProgramacion : string = String(localStorage.getItem('idProgramElegida'));
        this.controlProgramacionService.registrarInscripcion({
          idFichaAdmision: data.data[0].idFichaAsegurado,
          idUnidadOperativa: unidadOperativa,
          idProgramacionDet: selectedProgramacion,
          acreditado: data.data[0].acreditacion,
          idUsuarioReg: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario,
          conConexion: conexion
        }).subscribe(data => {
          if(data.code == "0"){
            this.getListTablaAsegurados();
          }
          else{
            this.toast.warning(data.message);
          }
        })
      }
      else{
        this.notificacionService.warning(data.message);
      }
      this.esperaBusqueda = false;
    })

    this.ctrlSearch.setValue('');
  }

  onAutocompleteScroll(){
   //console.log("data-load-dev")
  }
}
