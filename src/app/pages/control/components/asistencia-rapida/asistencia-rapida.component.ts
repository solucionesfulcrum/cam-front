import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, LOCALE_ID, Renderer2, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowsUpToLine, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AsistenciaLista, AsistenciaRapidaLista, DataResponse, DataResponseAsistenciaRapida, RequestBuscarApto, RequestBuscarAptoNacional } from '@models/control/asistencia/crud-asistencia.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { ModalAlertComponent } from '@shared/components/modal-alert/modal-alert.component';
import { ToastrService } from 'ngx-toastr';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ModalConfirmarComponent } from '../sub-components/dialogs/modal-confirmar/modal-confirmar.component';
import { ModalEditarComponent } from '../sub-components/dialogs/modal-editar/modal-editar.component';
import { DialogConfirmDataAsistenciaComponent } from '../tab-asistencia/dialog/dialog-confirm-data-asistencia/dialog-confirm-data-asistencia.component';
import { dataTest } from '../crear-cabecera-asistencia-rapida/dataTest';
import { DataSourceList } from './data-source';
import { ModalConfirmarGenericoComponent } from '@shared/components/modal-confirmar-generico/modal-confirmar-generico.component';

@Component({
  selector: 'esp-asistencia-rapida',
  templateUrl: './asistencia-rapida.component.html',
  styleUrls: ['./asistencia-rapida.component.scss']
})
export class AsistenciaRapidaComponent {

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

  idAsisRap! : number;

  listBusqueda: any[] = [];
  listFilteredBusqueda: any[] = [];

  statusLoadingBarra = false;

  @ViewChild('frmDoc') frmDocElement!: ElementRef;

  public formBuscarPersona = this.fb.nonNullable.group({
    frmSelectDoc: new FormControl('1'),
    frmDoc: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
  });

  esperaBusqueda: boolean = false;

  dataSourceList = new DataSourceList();

  seleccionados : number[] = [];

  dropdownOpen: boolean = false;
  chkHeader: boolean = false;

  intervalos: number = 1;
  sesionActual: number = 1;


  //DATA PRUEBA
  dataPrueba: AsistenciaRapidaLista[] = [];
  dataSource: AsistenciaRapidaLista[] = [];
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

  loadingPaginacion : boolean = false;

  txtBusca : string = '';

  private searchTimeout: any;
  isMaxScroll: boolean = false;
  txtScroll: string = '';
  pageScroll: number = 1;

  codUoCiram: string = '';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private datosService: DatosGeneralesService,
    private controlService: ControlProgramacionService,
    @Inject(LOCALE_ID) private locale: string,
    private notificacionService: NotificationService,
    private dialog: MatDialog,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,
    private controlProgramacionService: ControlProgramacionService,
    private renderer: Renderer2,
    private route: ActivatedRoute 
  ) { 
    this.idAsisRap = parseInt(this.route.snapshot.paramMap.get('idAsisRap')!);
  }

  setFocusOnFrmDoc() {
    setTimeout(() => {
      const frmDocElement = this.renderer.selectRootElement('#frmDoc', true);
      frmDocElement.focus();
    });
  }

  ngOnInit(){

    this.setDocumentValidators("1");

    this.ctrlTypeSearch.valueChanges.subscribe(ctrlType=>{
      if(ctrlType == 3){
        this.setFocusOnFrmDoc();
      }
    })

    
    this.formBuscarPersona.get('frmDoc')!.valueChanges.subscribe(ctrlType=>{
      if(this.ctrlTypeSearch.value == 3){
        this.setFocusOnFrmDoc();
        if(this.formBuscarPersona.get('frmDoc')?.valid){
          this.onAseguradoSelectCodigoBarra("");
          this.setFocusOnFrmDoc();
        }
      }
    })

    this.formBuscarPersona.get('frmSelectDoc')!.valueChanges.subscribe(value => {
      this.formBuscarPersona.get('frmDoc')?.setValue("");
      this.setDocumentValidators(value!);
    })

    this.getDataCabecera();
    this.getParametros();
    //this.getListAsegurados();
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
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout); 
      }
      this.searchTimeout = setTimeout(() => {
        if (typeof data !== 'object') {
          this.listBusqueda = [];
          this.getListAseguradosFindByText(data.toLocaleUpperCase());
        }
      }, 500); 
    })
  }

  
 

  getDataCabecera(){
    this.controlService.getCabeceraClaseRapida(this.idAsisRap).subscribe((data)=>{
      if (data.code == 0) {
        this.datoProgramacion = data.data;
        ////console.log(this.datoProgramacion)
        let seconds = Math.floor((new Date(this.datoProgramacion.fecha + ' ' + this.datoProgramacion.horaFin).getTime() - new Date(this.datoProgramacion.fecha + ' ' + this.datoProgramacion.horaIni).getTime())/1000);
        let horas = Math.floor(seconds/(60*60));

        let totalMinutes = Math.floor(seconds / 60); // Convertir segundos a minutos
        let intervals = Math.floor(totalMinutes / 45); // Dividir minutos entre 45 para obtener los intervalos

        let minutos = Math.floor(seconds/60) - horas*60;
        this.datoProgramacion.margenHorario = horas + 'h ' +  minutos + ' m';

        this.intervalos = intervals; // Guardar los intervalos

        this.codUoCiram = "";
        this.getListAsegurados()
        ////console.log(Math.floor(seconds/(60*60)) + 'h ' +  Math.floor(seconds/60) + ' m')
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })
  }

  cambiarSesion(movimiento: number){
    this.sesionActual += movimiento;
  }

  getDatosSesion(movimiento: number){
    this.sesionActual += movimiento;

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
      this.seleccionados =  this.dataSource.map(data => { return data.idAsisRapidDet});
    else
      this.seleccionados = [];
  }

  getListTablaAsegurados() : void{
    this.controlService.listarAsistenciaRapida(this.idAsisRap)
    .subscribe(data => {
      let dataAsistentes = (data.data as AsistenciaRapidaLista[]).map((asistente : AsistenciaRapidaLista, index: number)=>{
  
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

 
  llenarDatosTabla(data : DataResponseAsistenciaRapida<AsistenciaRapidaLista>){
    this.dataSource = data.data.list;
    this.dataSourceList.init(data.data.list)

    this.pageNum = data.data.pageNum;
    this.pageSize = data.data.pageSize;
    this.total = data.data.total;
  }

   // Busqueda y Tipeo de Asegurado --------------------------------------------------------------
   onAseguradoSelect(event: any){
    let payload: RequestBuscarAptoNacional = {
      tipDoc: event.option.value.tipoDoc === 'DNI' ? '1' : '4',
      numDoc: event.option.value.numDoc
    }
    this.controlService.getSiEsAptoNacional(payload).subscribe((data)=>{
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
        if(data.data[0].acreditacion){
          this.controlProgramacionService.registrarInscripcionAsistenciaRapida({
            idAsegurado: data.data[0].idAsegurado,
            idAsisRapid: this.datoProgramacion.idAsisRapido
          }).subscribe(data => {
            if(data.code == "0"){
              this.getListTablaAsegurados();
              this.toast.success(data.message);
            }
            else{
              this.toast.warning(data.message);
            }
          })
        }
        
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
    let payload: RequestBuscarAptoNacional = {
      tipDoc: tipoDoc,
      numDoc: numDoc
    }
    this.esperaBusqueda = true;
    this.controlService.getSiEsAptoNacional(payload).subscribe((data)=>{
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
    console.log(element);
    if(element.checked)
      this.seleccionados.push(parseInt(element.value))
    else
      this.seleccionados = this.seleccionados.filter(item => item != parseInt(element.value));

  }

  eliminarAsegurados(){
    let asistentesEliminar: number[] = this.dataSource
    .filter((asistente: AsistenciaRapidaLista) => this.seleccionados.includes(asistente.idAsisRapidDet))
    .map((asistente: AsistenciaRapidaLista) => asistente.idAsisRapidDet as number);

    ////console.log(asistentesEliminar);
    this.controlService.eliminarRegistradosAsistenciaRapida(asistentesEliminar).subscribe(data=>{
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

  getListAseguradosFindByText(texto: string){
    this.pageScroll = 1;
    this.txtScroll = texto;
    this.isMaxScroll = false;
    this.esperaBusqueda = true;
    let metodo;
    metodo = this.controlService.getListAseguradosNacional(texto, 1, 10);
    metodo.subscribe((data)=>{
      this.esperaBusqueda = false;
      this.loadingPaginacion = false;
      if (data.code == 0) {
        setTimeout(()=>{
          this.listBusqueda = [];
          this.listFilteredBusqueda = [];
          setTimeout(() => {
            
          this.listBusqueda = data.data.list;
          this.listFilteredBusqueda = this.listBusqueda;
          }, 50);
        })
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })
  }

  getListAseguradosScroll(){
    this.esperaBusqueda = true;
    let metodo;
    metodo = this.controlService.getListAseguradosNacional(this.txtScroll, this.pageScroll, 10);
    metodo.subscribe((data)=>{
      this.esperaBusqueda = false;
      this.loadingPaginacion = false;
      if (data.code == 0) {
        data.data.list.map((item : any)=>{
          this.listBusqueda.push(item)
        })
        this.listFilteredBusqueda = this.listBusqueda;
        if(this.listFilteredBusqueda.length == data.data.navigatePages){
          this.isMaxScroll = true;
        }
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })
  }

  getListAsegurados(){
    this.esperaBusqueda = true;
    let metodo;
    metodo = this.controlService.getListAseguradosNacional("", 1, 10);
    metodo.subscribe((data)=>{
      this.esperaBusqueda = false;
      if (data.code == 0) {
        this.listBusqueda = [];
        this.listFilteredBusqueda =  [];
        this.listBusqueda = data.data.list;
        this.listFilteredBusqueda = this.listBusqueda;
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
    console.log(documentType)
    console.log(documentNumberControl.value)
    if (documentType === '1') {
      this.formBuscarPersona.get('frmDoc')!.setValidators([
        Validators.required,
        Validators.pattern(/^\d{8}$/)
      ]);
    } else if (documentType === '4') {
      this.formBuscarPersona.get('frmDoc')!.setValidators([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]{9}$/)
      ]);
    }
    else if (documentType === '23') { // Suponiendo que 'X' es el tipo de documento para el permiso temporal de permanencia
      this.formBuscarPersona.get('frmDoc')!.setValidators([
      Validators.required,
      Validators.pattern(/^\d{9}$/) // Ajusta el patrón según el formato del permiso temporal de permanencia
    ]);
  } else if (documentType === '7') { // Suponiendo que 'P' es el tipo de documento para el pasaporte
    this.formBuscarPersona.get('frmDoc')!.setValidators([
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9]{9}$/) // Ajusta el patrón según el formato del pasaporte
    ]);
  }
    else {
      this.formBuscarPersona.get('frmDoc')!.setValidators(Validators.required);
    }
    this.formBuscarPersona.get('frmDoc')!.updateValueAndValidity();
  }

  onAseguradoSelectCodigoBarra(event: any) : void{
   
    if(!this.formBuscarPersona.get("frmDoc")?.valid){
      return ;
    }
    let payload: RequestBuscarAptoNacional = {
      tipDoc:  String(this.formBuscarPersona.get("frmSelectDoc")?.value),
      numDoc: String(this.formBuscarPersona.get("frmDoc")?.value)
    }
    this.statusLoadingBarra = true;
    this.formBuscarPersona.get("frmDoc")?.setValue('');
    this.controlService.getSiEsAptoNacional(payload).subscribe((data)=>{
      if ((data.code == 0 || data.code == 2) && (data.data && data.data.length > 0)) {
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
        
        if(data.data[0].acreditacion)
        this.controlProgramacionService.registrarInscripcionAsistenciaRapida({
          idAsegurado: data.data[0].idAsegurado,
          idAsisRapid: this.datoProgramacion.idAsisRapido
        }).subscribe(data => {
          if(data.code == "0"){
            if(this.ctrlTypeSearch.value == 3){
              this.formBuscarPersona.get('frmDoc')?.setValue("");
              this.formBuscarPersona.get('frmDoc')?.setValue("");
            }
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
      this.statusLoadingBarra = false;
    })

    this.ctrlSearch.setValue('');
  }

  onAutocompleteScroll(){
    if(!this.loadingPaginacion && !this.isMaxScroll && this.listFilteredBusqueda.length > 5){
      this.pageScroll++;
      this.loadingPaginacion = true;
      this.getListAseguradosScroll();
    }
  }

  modalFinalizarClase(){
    this.dialog.open(ModalConfirmarGenericoComponent, {
      data:{
        message: 'Finalizar la Clase'
      }
    }).afterClosed().subscribe(data=>{
      if(data.success){
        this.finalizarClase();
      }
    });
  }

  finalizarClase(){
    this.controlService.finalizarClase(this.idAsisRap).subscribe(data=>{
      if(data.code == 0){
        this.toast.success("La clase ha sido finalizada");
        this.datoProgramacion.estado = "FINALIZADO";
      }
      else{
        this.toast.warning(data.message);
      }
    }, (error) => {
      this.toast.error("Ocurrió un error")
    });
  }


  irAEditarClase(){
    this.router.navigate(['/app/control/asistencia-rapida/editar-cabecera/'+this.idAsisRap])
  }
}
