import { Component, HostListener } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { imprimirRequestCam } from '@models/afiliados/ficha-solicitud.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { SesionesCabecera } from '@models/reportes/reportes-tallerista';
import { NotificationService } from '@services/notification.service';
import { ModalAlertComponent } from '@shared/components/modal-alert/modal-alert.component';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { ParamMenu } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ProgramacionContratosService } from 'src/app/data/services/programacion/programacion-contratos.service';
import { ReportesTalleristaService } from 'src/app/data/services/reportes/reportes-tallerista.service';
import { InscripcionModalComponent } from '../../modals/inscripcion-modal/inscripcion-modal.component';
import { Dialog } from '@angular/cdk/dialog';
import { InscripcionModalTalleristaComponent } from '../../modals/inscripcion-modal-tallerista/inscripcion-modal-tallerista.component';
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { InscripcionTalleristaControlService } from 'src/app/events/control/inscripcion-tallerista-control.service';
import { ModalConfirmarComponent } from '../sub-components/dialogs/modal-confirmar/modal-confirmar.component';
import { ModalEditarComponent } from '../sub-components/dialogs/modal-editar/modal-editar.component';
import { AsistenciaSesion, RequestRegisterCabecera, RequestRegisterDet } from '@models/control/asistencia/service-asistencia.model';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { ModalConfirmarGenericoComponent } from '@shared/components/modal-confirmar-generico/modal-confirmar-generico.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'esp-control-tallerista-sesiones',
  templateUrl: './control-tallerista-sesiones.component.html',
  styleUrls: ['./control-tallerista-sesiones.component.scss']
})
export class ControlTalleristaSesionesComponent {

  private eventoSubscription!: Subscription;
 
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Exportar Excel', colorBtn: 'bordeado'},
    {texto: 'Modificar Asistencia', colorBtn: 'bordeado'},
    {texto: 'Finalizar', colorBtn:'mezclado'},
  ];
  idProgramacion!: string;
  rutasContrato=[
    {url:`/app/programacion/show/${this.idProgramacion}`, title:'Servicios Contratados'},
    {url:`/app/programacion/show/${this.idProgramacion}/programados`, title:'Servicios Programados'},
  ];
  faSpinner = faSpinner;
  dataContrato: any;

  idProgSubDetActual! : {idProgSubDet: number, nroSesion: number};

  sessionSeleccionada : number = 1;
  sesiones! : SesionesCabecera[];

  modificaAsistencia : boolean = false;

  opciones: Parametro[] = [];

  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
  });

  statusCierreLoading: boolean = false

  seleccionados : number[] = [];
  dropdownOpen: boolean = false;
  idControlAsistenciaCab! : number;

  dataAcciones: ParamMenu[] = [
    {texto: 'Descargar Excel', svgDir: 'assets/svg/icon-excel.svg'}
  ];

  dataSource: any[] = [];
  dataSourceEliminados: any[] = [];
  columns: string[] = [
    'marcar',
    'indice',
    'asegurado',
    'documento',
    'nro_documento', 
    'hora_asistencia', 
    'condicion', 
  ];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageIndexEliminados = 0;
  pageNumEliminados = 1;
  pageSizeEliminados = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;
  totalEliminados = 0;

  //DATE SERVIDOR
  fechaActualServidor! : Date;

  //CABECERA
  dataEmptyMsg = "No existen registros.";

  //DETALLES DEL TALLER
  nombreServicio: string = "";
  fechaServicio: string = "";
  horaFin: string = "";
  horaInicio: string = "";

  strFechaDescripcion: string = ""
  loadingDetalleTaller : boolean = false;
  completeLoadingDetalleTaller : boolean = false;
  dataEmpty : boolean = false;
  //


  //SESIONES
  idControlAsistenciaDet!: number;
  //

  loadingData : boolean = false;
  idProgDet : string = "";
  
  constructor( private fb                      : FormBuilder,
    private dialog : MatDialog,
    private programacionService     : ProgramacionContratosService,
    private datosService             : DatosGeneralesService,
    private notificationService     : NotificationService,
    private reportService : ReportesTalleristaService,
    private activateRoute: ActivatedRoute,
    private eventService : InscripcionTalleristaControlService,
    private controlService                    : ControlProgramacionService,
    private toast: ToastrService
  ){
      /*if(localStorage.getItem('idProgSubDetActual')){
        this.idProgSubDetActual = JSON.parse(localStorage.getItem('idProgSubDetActual')!);
      }*/
    }

    ngOnInit(){
      //ESCUCHA EL EVENTO DE AGREGAR USUARIO
      this.eventoSubscription = this.eventService.evento$.subscribe(mensaje =>{
        this.modificarCabeceraSesion(this.sessionSeleccionada, 1);
        this.loadData();
      })

      this.datosService.getTipoParametros('ESTADO_CONTROL_ASISTENCIA').subscribe((data)=>{
        if (data.code == 0) {
          this.opciones = data.data;
        }
        else{
          this.notificationService.warning(data.message);
        }
      });
      this.activateRoute.paramMap.subscribe(params => {
        this.idProgDet = params.get('idProgramacion')!;
        this.loadingDetalleTaller = true;
        this.datosService.getFechaServidor().subscribe(fechaData=>{
          this.fechaActualServidor = new Date(fechaData.data.fechaHoraActual);
          this.getDetalleTaller(this.idProgDet);
        })
        
      });
    }

    getFechaServidor(){
      this.datosService.getFechaServidor().subscribe(fechaData=>{
        this.fechaActualServidor = new Date(fechaData.data.fechaHoraActual);
      })
    }

    getDetalleTaller(idProgDet: string){
      
      this.reportService.getDataCabeceraAsistenciaTaller(idProgDet).subscribe(rpta=>{
        
        this.loadingDetalleTaller = false;
        this.completeLoadingDetalleTaller = true;
        //this.dataEmpty = rpta.code == 2;
        if(rpta.code == 1 || rpta.code == 2){
          this.dataEmpty = true;
          if(rpta.code == 1){
            this.dataEmptyMsg = "Hubo un error en el servicio"
          }
          
          if(rpta.code == 2){
            this.dataEmptyMsg = "No existen registros."
          }
        }
        this.nombreServicio = rpta.data.nombreServicio;
        this.fechaServicio = rpta.data.fechaServicio;
        this.horaInicio = rpta.data.horaInicio;
        this.horaFin = rpta.data.horaFin;
        this.sesiones = rpta.data.listaProgSubDet;
        this.idControlAsistenciaCab = rpta.data.idControlAsistenciaCab;

        let fechaInicioTaller = new Date(rpta.data.fechaServicio + " " + rpta.data.horaInicio);
        
        this.opcionesBotones[1].deshabilitado = rpta.data.cerradoCabecera
        this.opcionesBotones[2].deshabilitado = rpta.data.cerradoCabecera

        if(fechaInicioTaller > this.fechaActualServidor){
          this.opcionesBotones[1].deshabilitado = true
          this.opcionesBotones[2].deshabilitado = true
        }

        this.idControlAsistenciaDet = rpta.data.listaProgSubDet.filter(e=>e.numeracion == this.sessionSeleccionada)[0].idControlAsistenciaDet
        setTimeout(()=>{
          this.loadData();
        })
      })
    }


    
    loadData(){
      setTimeout(() => {
        this.seleccionados = [];
        this.loadingData = true;
        if(this.idControlAsistenciaDet){
          forkJoin(this.reportService.getDataReporteAsistenciaTaller(this.idControlAsistenciaDet), 
          this.reportService.getDataReporteAsistenciaTallerEliminados(this.idControlAsistenciaDet)).subscribe((response)=>{
            this.loadingData = false;
            if (response[0].code == 0) {
              this.dataSource = response[0].data.map(data => {
                return {...data, agregadoFueraDeFecha: this.fechaServicio != data.fechaHoraAsistencia.split("T")[0]}
              });
              this.total= response[0].data.length;
            }
            else {
              this.notificationService.warning(response[0].message);
            }
  
            if (response[1].code == 0) {
              this.dataSourceEliminados = response[1].data.map(data => {
                return {...data, agregadoFueraDeFecha: this.fechaServicio != data.fechaHoraAsistencia.split("T")[0]}
              });
              this.totalEliminados= response[1].data.length;
            }
            else {
              this.notificationService.warning(response[1].message);
            }
          })
        }
        else{
          this.sessionSeleccionada = 0;
          this.loadingData = false;
        }
      
      });
      
    }
    
    imprimirLista(){
      this.reportService.getExcelDetalleTallerTallerista(this.idProgDet).subscribe((data)=>{
        this.notificationService.success('Se esta descargando el reporte');
        const blob: Blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = 'Reporte_Detalle_Tallerista.xlsx';
        anchor.href = url;
        anchor.click();
        window.URL.revokeObjectURL(url);
      })
    }


    
    handlePageEvent(event: PageEvent) {
      this.pageSize = event.pageSize;
      this.pageIndex = event.pageIndex;
      this.pageNum = event.pageIndex + 1;
      this.loadData();
    }

    handlePageEventEliminados(event: PageEvent) {
      this.pageSizeEliminados = event.pageSize;
      this.pageIndexEliminados = event.pageIndex;
      this.pageNumEliminados = event.pageIndex + 1;
      this.loadData();
    }

    setSesion(nroSesion: number, idControlAsistenciaDet: number, countAsistencia: number, idProgSubDet: number){
      this.sessionSeleccionada = nroSesion;
      if(idControlAsistenciaDet){
        this.idControlAsistenciaDet = idControlAsistenciaDet
        this.loadData();
      }
      else{
        this.crearCabecera(nroSesion, idProgSubDet);
      }
      
    }

    crearCabecera(nroSesion: number, idProgSubDet: number): void {
      let payload: RequestRegisterCabecera = {
        idProgramacionDet: parseInt(this.idProgDet),
        userCreacion: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario,
      };
      this.controlService.registerDataAsistenciaCabecera(payload).subscribe((data)=>{
        if (data.code == 0) {
          const payloadSesion : RequestRegisterDet= {
            idControlAsistenciaCab: data.data.idControlAsistenciaCab,
            idProgramacionSubDet: idProgSubDet,
            numeracion: nroSesion
          }
          this.controlService.registerAsistenciaDet(payloadSesion).subscribe(dataResponseSesion=>{
            this.getDetalleTaller(this.idProgDet)
          })
        }
        else{
          //this.statusAsistencia = 'failed';
          //this.notificacionService.warning(data.message);
        }
      })
    }

    cabeceraSesion(): void{

    }

    formatearFechaHora(fecha :string, horaInicio :string, horaFin :string) {
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

      // Dividir la fecha en partes (año, mes, día)
      const partesFecha = fecha.split('-');
      const ano = parseInt(partesFecha[0], 10);
      const mes = parseInt(partesFecha[1], 10) - 1; // Restamos 1 para ajustar al formato de JavaScript
      const dia = parseInt(partesFecha[2], 10);
    
      // Crear el objeto Date con las partes de la fecha
      const fechaObjeto = new Date(ano, mes, dia);
    
      // Obtener el día de la semana, el día del mes y el mes
      const diaSemana = diasSemana[fechaObjeto.getDay()];
      const diaMes = fechaObjeto.getDate();
      const nombreMes =  fechaObjeto.toLocaleString('es-ES', { month: 'long' });
    
      // Convertir las horas de texto a objetos Date
      const horaInicioObjeto = new Date(`1970-01-01T${horaInicio}:00`);
      const horaFinObjeto = new Date(`1970-01-01T${horaFin}:00`);
    
      // Formatear las horas en formato AM/PM
      const horaInicioFormateada = horaInicioObjeto.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const horaFinFormateada = horaFinObjeto.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
      // Formatear la fecha y hora en el formato deseado
      const resultado = `${diaSemana}, ${diaMes} de ${nombreMes} de ${horaInicioFormateada} - ${horaFinFormateada}`;
      
      return resultado;
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

    eliminarAsegurados(){
     let asistentesEliminar: number[] = this.dataSource
      .filter((asistente: AsistenciaSesion) => this.seleccionados.includes(asistente.idControlAsistenciaSubDet))
      .map((asistente: AsistenciaSesion) => asistente.idControlAsistenciaSubDet as number);
  
      ////console.log(asistentesEliminar);
      this.controlService.actualizarEstadoEliminadoRegistradosHistorico(asistentesEliminar).subscribe(data=>{
        if(data.code == 0){
          this.toast.success("Los registros han sido eliminados");
          this.loadData();
          this.modificarCabeceraSesion(this.sessionSeleccionada,asistentesEliminar.length*(-1))
          this.seleccionados = [];
        }
        else{
          this.toast.error("Ocurrió un error eliminando los registros");
        }
      })
    }

  modificarCabeceraSesion(numeracion: number, cambio: number){
    this.sesiones[numeracion-1].countAsistencia += cambio;
  }
  
    

  modificarAsistencia(){
    if(!this.modificaAsistencia){
      this.modificaAsistencia = true;
      this.opcionesBotones[1].texto = "Guardar";
    }
    else{
      this.modificaAsistencia = false;
      this.opcionesBotones[1].texto = "Modificar Asistencia";
    }
  }

  finalizar(){

  }

  
  esBoolean(data: any): boolean {
    return typeof data === 'boolean'
  }

  
  cerrarAsistencia(){
    
    let dialog = this.dialog.open(ModalConfirmarGenericoComponent, {
      width: "30%",
     data:{
       message: "¿Está seguro de finalizar el taller?"
     }
   })

   dialog.afterClosed().subscribe(response=>{
    if(response.success){
      forkJoin(
        this.controlService.registerCierreDetalleControl(this.sesiones[0].idControlAsistenciaDet),
        (this.sesiones.length > 1 ? this.cerrarCierreDetalle(this.sesiones[1]) :  of(null)),
        (this.sesiones.length > 2 ? this.cerrarCierreDetalle(this.sesiones[2]) :  of(null))
      ).subscribe(result => {
        this.statusCierreLoading = true;
      this.controlService.registerCierreCabeceraControl(this.idControlAsistenciaCab).subscribe((dataCierre)=>{
        this.statusCierreLoading = false;
        if (dataCierre.code == 0) {
          this.opcionesBotones[1].deshabilitado = true;
          this.opcionesBotones[2].deshabilitado = true;
   
          this.modificaAsistencia = false;
          this.notificationService.success("Se ha finalizado al taller exitósamente");
          
        }
        else{
          this.notificationService.warning(dataCierre.message);
        }
      })
      })
    }
    
    
      
     
       
     
   })
   
  }


  cerrarCierreDetalle(obj: any): Observable<any>{
    return obj.idControlAsistenciaDet ? this.controlService.registerCierreDetalleControl(obj.idControlAsistenciaDet) : of(null)
  }

  levantarModalAgregarAsegurado(){
    const dialogRef = this.dialog.open(InscripcionModalTalleristaComponent,{
      minWidth:'900px',
      width:'900px',
      data:{
        idControlAsistenciaDet : this.idControlAsistenciaDet,
        dataSource: this.dataSource
      }
    })
    dialogRef.afterClosed().subscribe(out =>{
      //this.onLoadData();
    })
  }






}
