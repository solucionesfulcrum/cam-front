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
import { DialogFotoFinalizaClaseComponent } from '../dialog/dialog-foto-finaliza-clase/dialog-foto-finaliza-clase.component';
import { environment } from '@environments/environment';

@Component({
  selector: 'esp-asistencia-rapida',
  templateUrl: './asistencia-rapida.component.html',
  styleUrls: ['./asistencia-rapida.component.scss']
})
export class AsistenciaRapidaComponent {

  svgDir = faArrowsUpToLine;
  loadingSesion = false;
  
  variablesEntorno = environment.environment

  selectedFile: File | null = null;
  fileUploaded: boolean = false; // Para detectar si ya hay un archivo subido
  rutaEvidencia: string = "";

  
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
  finalizaClaseStep: boolean = false;

  selectedOptions: {[key : number] : boolean} = [];

  idAsisRap! : number;
  esCiram: boolean = false;
  listBusqueda: any[] = [];
  listFilteredBusqueda: any[] = [];

  statusLoadingBarra = false;

  @ViewChild('frmDoc') frmDocElement!: ElementRef;

  public formBuscarPersona = this.fb.nonNullable.group({
    frmSelectDoc: new FormControl('1'),
    frmDoc: ['', [Validators.required]],
    fechaNac: ['']
  });

  esperaBusqueda: boolean = false;

  dataSourceList = new DataSourceList();

  seleccionados : number[] = [];

  dropdownOpen: boolean = false;
  chkHeader: boolean = false;

  intervalos: number = 1;
  sesionActual: number = 1;

  idRol!: number;
  descCifra!: string;
  idUnidadOperativaTaller: number = 0;


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

  cierreDeClases: boolean = false;
  siguienteActivo: boolean = false;
  idSesionActual: number = 0;
  estadoSesionActual: string = "0";

  txtBusca : string = '';

  private searchTimeout: any;
  isMaxScroll: boolean = false;
  txtScroll: string = '';
  pageScroll: number = 1;

  nombreCiram: string = "";
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

    if((JSON.parse(localStorage.getItem('UnidElegida')!)).tipo === 'CIRAM'){
      this.codUoCiram = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;
    }
    else{
      this.codUoCiram = "";
    }

    this.setDocumentValidators("1");

    this.ctrlTypeSearch.valueChanges.subscribe(ctrlType=>{
      if(ctrlType == 3){
        this.setFocusOnFrmDoc();
      }
    })

    
    this.formBuscarPersona.get('frmDoc')!.valueChanges.subscribe(ctrlType=>{
      if(this.ctrlTypeSearch.value == 3){
        this.setFocusOnFrmDoc();
        if(this.formBuscarPersona.get('frmDoc')?.valid && String(this.formBuscarPersona.get("frmSelectDoc")?.value) == "1"){
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
  }

  registrarAsistencia(){
    if(this.ctrlTypeSearch.value == 3 || this.ctrlTypeSearch.value == 2){
      this.setFocusOnFrmDoc();
      if(this.formBuscarPersona.get('frmDoc')?.valid){
        this.onAseguradoSelectCodigoBarra("");
        this.setFocusOnFrmDoc();
      }
    }
  }

  getParametros(){
    this.datosService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data) =>{
      this.opciones = data.data;
      
      this.getSesion();
    });
  }

  getKeysWithTrueValues(selectedOptions: { [key: number]: boolean }): number[] {
    return Object.keys(selectedOptions)
      .filter(key => selectedOptions[parseInt(key)]) // Filtra solo las claves cuyo valor es true
      .map(key => parseInt(key)); // Convierte las claves a números
  }

  getSesion(){
    this.loadingSesion = true;
    this.controlProgramacionService.getSesionClaseRapida({
      idAsisRapid: this.idAsisRap,
      idUser: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario,
      nroSesion: this.sesionActual,
      usuarios: this.getKeysWithTrueValues(this.selectedOptions)
    }).subscribe(data=>{
      this.loadingSesion = false;
      this.idSesionActual = data.data.idSesion;
      this.estadoSesionActual = data.data.estado;
      this.cierreDeClases = data.data.cierreDeClases;
      this.siguienteActivo = data.data.siguienteActivo;
      this.selectedOptions = [];
      this.fileUploaded = data.data.rutaEvidencia;
      this.rutaEvidencia = data.data.rutaEvidencia;

      if(!data.data.siguienteActivo && this.estadoSesionActual == 'FINALIZADO' && !this.cierreDeClases){
        this.columns = ['marcar',
          'orden',
          'nombreCompleto',
          'continua',
          'tipoDoc',
          'numDoc',
          'horaAsistencia',
          'birthday'
        ];
      }
      else{
        this.columns = ['marcar',
          'orden',
          'nombreCompleto',
          'tipoDoc',
          'numDoc',
          'horaAsistencia',
          'birthday'
        ];
      }

      this.getListTablaAsegurados();
    })
    
  }

  IrAHora(){
    if(!(this.sesionActual == this.intervalos && this.cierreDeClases)){
      this.cambiarSesion(1);
    }
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
        let intervals = 1 //Math.floor(totalMinutes / 45); // Dividir minutos entre 45 para obtener los intervalos

        let minutos = Math.floor(seconds/60) - horas*60;
        this.datoProgramacion.margenHorario = horas + 'h ' +  minutos + ' m';

        this.intervalos = intervals; // Guardar los intervalos

        this.nombreCiram = this.datoProgramacion.nombreUO;
        this.esCiram = this.datoProgramacion.esCiram;
        this.idRol = this.datoProgramacion.idRol;
        this.idUnidadOperativaTaller = this.datoProgramacion.idUnidadOperativa;
        //esCiram

        
        if(this.datoProgramacion.idRol == 7){
          this.descCifra = "Nro de Taller";
        }

        if(this.datoProgramacion.idRol == 9){
          this.descCifra = "Nro de Actividad";
        }


        
        this.setListeners();
        this.getListAsegurados()
        ////console.log(Math.floor(seconds/(60*60)) + 'h ' +  Math.floor(seconds/60) + ' m')
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })
  }

  activarFinalizarClase(status: boolean){
    this.finalizaClaseStep = status;
  }

  cambiarSesion(movimiento: number){
    this.loadingSesion = true;
    this.sesionActual += movimiento;
    this.seleccionados = [];
    this.getSesion();
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
    this.controlService.listarAsistenciaRapida(this.idSesionActual)
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

    this.dataSource.map(data => {
      this.selectedOptions[data.idAsegurado] = true;
    })

    this.pageNum = data.data.pageNum;
    this.pageSize = data.data.pageSize;
    this.total = data.data.total;
  }

   // Busqueda y Tipeo de Asegurado --------------------------------------------------------------
   onAseguradoSelect(event: any){
    let codUo;
    if(this.esCiram){
      codUo = this.idUnidadOperativaTaller;
    }
    else{
      codUo = this.idUnidadOperativaTaller;
    }
    let payload: RequestBuscarApto = {
      idUnidadOperativa: codUo,
      tipDoc: event.option.value.tipoDoc === 'DNI' ? '1' : '4',
      numDoc: event.option.value.numDoc,
      fechaNacimiento: event.option.value.tipoDoc != 'DNI' ? event.option.value.fechNac : null,
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
        if(data.data[0].acreditacion || true){
          this.controlProgramacionService.registrarInscripcionAsistenciaRapida({
            idAsegurado: data.data[0].idAsegurado,
            idAsisSesionRapid: this.idSesionActual
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

  searchSiApto(tipoDoc: string, numDoc: string, fechaNacimiento: string){
    let codUo;
    if(this.esCiram){
      codUo = this.idUnidadOperativaTaller;
    }
    else{
      codUo = this.idUnidadOperativaTaller;
    }
    let payload: RequestBuscarApto = {
      idUnidadOperativa: codUo,
      tipDoc: tipoDoc,
      numDoc: numDoc,
      fechaNacimiento: tipoDoc != "1" ? fechaNacimiento : null
    }
    this.esperaBusqueda = true;
    this.controlService.getSiEsApto(payload).subscribe((data)=>{
      if (data.code == 0 || true) {
        if(data.code == 2){
          this.notificacionService.warning(data.message);
        }
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
    //metodo = this.controlService.getListAseguradosNacional(texto, 1, 10);
    if(this.esCiram){
      metodo = this.controlService.getListAseguradosCiramFindByText(texto, 1, 10, String(this.idUnidadOperativaTaller));
    }
    else{
      metodo = this.controlService.getListAseguradosSoloCamFindByText(texto, 1, 10);
    }
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
    //metodo = this.controlService.getListAseguradosNacional(this.txtScroll, this.pageScroll, 10);
    if(this.esCiram){
      metodo = this.controlService.getListAseguradosCiramFindByText(this.txtScroll, this.pageScroll, 10, String(this.idUnidadOperativaTaller));
    }
    else{
      metodo = this.controlService.getListAseguradosSoloCamFindByText(this.txtScroll, this.pageScroll, 10);
    }
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
    //metodo = this.controlService.getListAseguradosNacional("", 1, 10);
    if(this.esCiram){
      metodo = this.controlService.getListAseguradosCiram(String(this.idUnidadOperativaTaller));
    }
    else{
      metodo = this.controlService.getListAseguradosSoloCam();
    }
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
        //Validators.pattern(/^[a-zA-Z0-9]{9}$/)
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
    let codUo;
    if(this.esCiram){
      codUo = this.idUnidadOperativaTaller;
    }
    else{
      codUo = this.idUnidadOperativaTaller;
    }
   
    if(!this.formBuscarPersona.get("frmDoc")?.valid){
      return ;
    }
    let payload: RequestBuscarApto = {
      idUnidadOperativa: codUo,
      tipDoc:  String(this.formBuscarPersona.get("frmSelectDoc")?.value),
      numDoc: String(this.formBuscarPersona.get("frmDoc")?.value),
      fechaNacimiento: String(this.formBuscarPersona.get("frmSelectDoc")?.value) != "1" ? this.formBuscarPersona.get("fechaNac")!.value : null
    }

    this.statusLoadingBarra = true;
    this.formBuscarPersona.get("frmDoc")?.setValue('');
    this.controlService.getSiEsApto(payload).subscribe((data)=>{
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
        
        if(data.data[0].acreditacion || true)
        this.controlProgramacionService.registrarInscripcionAsistenciaRapida({
          idAsegurado: data.data[0].idAsegurado,
          idAsisSesionRapid: this.idSesionActual
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

  /*modalFinalizarSesion(){
    this.dialog.open(ModalConfirmarGenericoComponent, {
      data:{
        message: '¿Desea finalizar la sesión?'
      }
    }).afterClosed().subscribe(data=>{
      if(data.success){
        this.finalizarSesion();
      }
    });
  }*/

  modalFinalizarClase(){
    this.dialog.open(ModalConfirmarGenericoComponent, {
      data:{
        message: '¿Desea finalizar la clase?'
      }
    }).afterClosed().subscribe(data=>{
      if(data.success){
        this.dialog.open(DialogFotoFinalizaClaseComponent, {
          data:{
            idAsisRapSesion: this.idSesionActual
          }
        }).afterClosed().subscribe(
          (data)=>{
            if(false){
              this.finalizarClase();
            }
          }
        )
      }
    });
  }

  finalizarSesion(){
      this.controlService.finalizarSesion(this.idSesionActual).subscribe(data=>{
        if(data.code == 0){
          this.toast.success("La sesion ha sido finalizada");
          this.idSesionActual = data.data.idSesion;
          this.estadoSesionActual = data.data.estado;
          this.cierreDeClases = data.data.cierreDeClases;
          this.getSesion();

        }
        else{
          this.toast.warning(data.message);
        }
      }, (error) => {
        this.toast.error("Ocurrió un error")
      });
    
  }

  finalizarClase(){
    
    if(this.cierreDeClases){
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
  }

  finalizarSesionYTaller(){
    this.dialog.open(ModalConfirmarGenericoComponent, {
      data:{
        message: '¿Desea finalizar la clase?'
      }
    }).afterClosed().subscribe(data=>{
      if(["DEV", "Local"].includes(this.variablesEntorno)){
        if(data.success){
          this.dialog.open(DialogFotoFinalizaClaseComponent, {
            data:{
              idAsisRapSesion: this.idSesionActual
            },
            width: '700px'
          }).afterClosed().subscribe(
            (data)=>{
              if(data.success){
                this.controlService.finalizarSesion(this.idSesionActual).subscribe(data=>{
                  if(data.code == 0){
                    this.toast.success("La sesion ha sido finalizada");
                    this.idSesionActual = data.data.idSesion;
                    this.estadoSesionActual = data.data.estado;
                    this.cierreDeClases = data.data.cierreDeClases;
                    this.getSesion();
                    this.finalizarClase();
          
                  }
                  else{
                    this.toast.warning(data.message);
                  }
                }, (error) => {
                  this.toast.error("Ocurrió un error")
                });
              
              }
            }
          )
        }
      }
      else{
        if(data.success){
          this.controlService.finalizarSesion(this.idSesionActual).subscribe(data=>{
            if(data.code == 0){
              this.toast.success("La sesion ha sido finalizada");
              this.idSesionActual = data.data.idSesion;
              this.estadoSesionActual = data.data.estado;
              this.cierreDeClases = data.data.cierreDeClases;
              this.getSesion();
              this.finalizarClase();
    
            }
            else{
              this.toast.warning(data.message);
            }
          }, (error) => {
            this.toast.error("Ocurrió un error")
          });
        
        }
      }

    });
  }


  irAEditarClase(){
    if(this.datoProgramacion.estado == "ABIERTO"){
      this.router.navigate(['/app/control/asistencia-rapida/editar-cabecera/'+this.idAsisRap])
    }
    else{
      this.dialog.open(ModalConfirmarGenericoComponent, {
        data:{
          message: '¿Desea modificar el estado de la asistencia rápida finalizada?'
        }
      }).afterClosed().subscribe(data=>{
        if(data.success){
         this.controlService.reactivarAsistenciaRapida(this.idAsisRap).subscribe((data)=>{
          if(data.code == 0){
              this.router.navigate(['/app/control/asistencia-rapida/editar-cabecera/'+this.idAsisRap])
          }
          else{
              this.toast.warning(data.message);
          }
         })
        }
      });
    }
  }

  

  //OPERACIONES DE ARCHIVO
    // Método para descargar el archivo ya subido

      // Método para manejar la selección de archivo

    // Método para abrir el selector de archivos
    triggerFileInput(fileInput: HTMLInputElement): void {
      fileInput.click(); // Dispara el evento de clic en el input file
    }

    onFileSelected(event: any): void {

      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif']; // Tipos MIME permitidos
      if (!validImageTypes.includes(event.target.files[0].type)) {
        this.toast.warning('Error: Solo se permiten archivos de imagen (JPG, PNG, GIF)')
        return; // Detener la subida si no es una imagen
      }
  
        this.dialog.open(ModalConfirmarGenericoComponent, {
          data:{
            message: 'La evidencia de la clase no se puede cambiar ¿Seguro de subir el archivo seleccionado?'
          }
        }).afterClosed().subscribe(data=>{
          if(data.success){
            this.selectedFile = event.target.files[0] || null;
              if (this.selectedFile) {
                this.uploadFile();
              }
          }
      });
     
    }


    // Método para subir el archivo usando el servicio
    uploadFile(): void {
      if (this.selectedFile) {
        // Validar que el archivo sea una imagen

        this.loadingSesion = true;
        this.controlProgramacionService.subirEvidenciaAsistenciaRapida(this.selectedFile, this.idSesionActual).subscribe(
          (data) => {
            console.log('Archivo subido con éxito');
            this.fileUploaded = true;
            this.rutaEvidencia = data.data.rutaEvidencia;
            this.loadingSesion = false;

            //QUE SE EJECUTE LA DESCARGA AQUI
          },
          (error) => {
            console.error('Error al subir el archivo', error);
            this.loadingSesion = false;
          }
        );
      }
    }

  // Método para descargar el archivo usando el servicio de descarga proporcionado
  downloadFile(): void {
    if (this.fileUploaded) {
      this.loadingSesion = true;
      this.controlProgramacionService.descargarEvidenciaAsistenciaRapida(this.idSesionActual).subscribe(
        (blob) => {
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = this.rutaEvidencia;
          link.click();
          window.URL.revokeObjectURL(url);
          this.loadingSesion = false;
        },
        (error) => {
          console.error('Error al descargar el archivo', error);
          this.loadingSesion = false;
        }
      );
    }
  }
}
