import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { imprimirRequestCam } from '@models/afiliados/ficha-solicitud.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { ReportesTalleristaPayload, SesionesCabecera } from '@models/reportes/reportes-tallerista';
import { NotificationService } from '@services/notification.service';
import { ModalAlertComponent } from '@shared/components/modal-alert/modal-alert.component';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { ParamMenu } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import { forkJoin } from 'rxjs';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ProgramacionContratosService } from 'src/app/data/services/programacion/programacion-contratos.service';
import { ReportesTalleristaService } from 'src/app/data/services/reportes/reportes-tallerista.service';

interface sesiones {
  participantes: number;
  nroSesion: number;
}

@Component({
  selector: 'esp-detalle-asistencias-taller',
  templateUrl: './detalle-asistencias-taller.component.html',
  styleUrls: ['./detalle-asistencias-taller.component.scss']
})
export class DetalleAsistenciasTallerComponent {

  
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Exportar', colorBtn:'white'},
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
  ){
     
    }

    ngOnInit(){
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

        this.idControlAsistenciaDet = rpta.data.listaProgSubDet.filter(e=>e.cursor)[0].idControlAsistenciaDet
        setTimeout(()=>{
          this.loadData();
        })
      })
    }
    
    loadData(){
      setTimeout(() => {
        this.seleccionados = [];
        this.loadingData = true;
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

    setSesion(nroSesion: number, idControlAsistenciaDet: number, countAsistencia: number){
      if(idControlAsistenciaDet){
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

  
    

  modificarAsistencia(){

  }

  finalizar(){

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

  
  esBoolean(data: any): boolean {
    return typeof data === 'boolean'
  }
}
