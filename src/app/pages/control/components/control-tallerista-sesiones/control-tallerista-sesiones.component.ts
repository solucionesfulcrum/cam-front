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
import { Subscription } from 'rxjs';
import { InscripcionTalleristaControlService } from 'src/app/events/control/inscripcion-tallerista-control.service';
import { ModalConfirmarComponent } from '../sub-components/dialogs/modal-confirmar/modal-confirmar.component';
import { ModalEditarComponent } from '../sub-components/dialogs/modal-editar/modal-editar.component';

@Component({
  selector: 'esp-control-tallerista-sesiones',
  templateUrl: './control-tallerista-sesiones.component.html',
  styleUrls: ['./control-tallerista-sesiones.component.scss']
})
export class ControlTalleristaSesionesComponent {

  private eventoSubscription!: Subscription;
 
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Guardar', colorBtn: 'bordeado'},
    {texto: 'Finalizar', colorBtn:'mezclado'},
  ];
  idProgramacion!: string;
  rutasContrato=[
    {url:`/app/programacion/show/${this.idProgramacion}`, title:'Servicios Contratados'},
    {url:`/app/programacion/show/${this.idProgramacion}/programados`, title:'Servicios Programados'},
  ];
  faSpinner = faSpinner;
  dataContrato: any;

  sessionSeleccionada : number = 1;
  sesiones! : SesionesCabecera[];

  opciones: Parametro[] = [];

  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
  });

  seleccionados : number[] = [];
  dropdownOpen: boolean = false;

  dataAcciones: ParamMenu[] = [
    {texto: 'Descargar Excel', svgDir: 'assets/svg/icon-excel.svg'}
  ];

  dataSource: any[] = [];
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
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;

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
    private eventService : InscripcionTalleristaControlService
  ){
     
    }

    ngOnInit(){
      //ESCUCHA EL EVENTO DE AGREGAR USUARIO
      this.eventoSubscription = this.eventService.evento$.subscribe(mensaje =>{
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
        this.getDetalleTaller(this.idProgDet);
      });
    }

    getDetalleTaller(idProgDet: string){
      this.loadingDetalleTaller = true;
      this.reportService.getDataCabeceraAsistenciaTaller(idProgDet).subscribe(rpta=>{
        this.loadingDetalleTaller = false;
        this.completeLoadingDetalleTaller = true;
        this.dataEmpty = rpta.code == 2;
        this.nombreServicio = rpta.data.nombreServicio;
        this.fechaServicio = rpta.data.fechaServicio;
        this.horaInicio = rpta.data.horaInicio;
        this.horaFin = rpta.data.horaFin;
        this.sesiones = rpta.data.listaProgSubDet;

        this.opcionesBotones[0].deshabilitado = rpta.data.cerradoCabecera
        this.opcionesBotones[1].deshabilitado = rpta.data.cerradoCabecera

        this.idControlAsistenciaDet = rpta.data.listaProgSubDet.filter(e=>e.cursor)[0].idControlAsistenciaDet
        setTimeout(()=>{
          this.loadData();
        })
      })
    }
    
    loadData(){
      setTimeout(() => {
        this.loadingData = true;
        this.reportService.getDataReporteAsistenciaTaller(this.idControlAsistenciaDet).subscribe((data)=>{
          this.loadingData = false;
          if (data.code == 0) {
            this.dataSource = data.data;
            this.total= data.data.length;
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

    
    handlePageEvent(event: PageEvent) {
      this.pageSize = event.pageSize;
      this.pageIndex = event.pageIndex;
      this.pageNum = event.pageIndex + 1;
      this.loadData();
    }

    setSesion(nroSesion: number, idControlAsistenciaDet: number, countAsistencia: number){
      if(countAsistencia > 0){
        this.sessionSeleccionada = nroSesion;
        this.idControlAsistenciaDet = idControlAsistenciaDet
        this.loadData();
      }
      else{
        this.dialog.open(ModalAlertComponent,
          {
            minWidth:'400px',
            maxWidth:'50%',
            width:'400px',
            data: {
              mensaje: "No hay participantes \n en la sesión"
            }
          }
        )
      }
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
      console.log('Opción seleccionada:', option);
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
          //this.eliminarAsegurados();
        }
      });
    }
  
    

  modificarAsistencia(){

  }

  finalizar(){

  }

  
  esBoolean(data: any): boolean {
    return typeof data === 'boolean'
  }

  levantarModalAgregarAsegurado(){
    const dialogRef = this.dialog.open(InscripcionModalTalleristaComponent,{
      minWidth:'900px',
      width:'900px',
      data:{
        idControlAsistenciaDet : this.idControlAsistenciaDet
      }
    })
    dialogRef.afterClosed().subscribe(out =>{
      //this.onLoadData();
    })
  }

}
