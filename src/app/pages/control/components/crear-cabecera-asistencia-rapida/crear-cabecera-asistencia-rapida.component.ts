import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, LOCALE_ID, Renderer2, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { faArrowsUpToLine, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AsistenciaLista, DataResponse, RequestBuscarApto } from '@models/control/asistencia/crud-asistencia.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { ModalAlertComponent } from '@shared/components/modal-alert/modal-alert.component';
import { ToastrService } from 'ngx-toastr';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ModalConfirmarComponent } from '../sub-components/dialogs/modal-confirmar/modal-confirmar.component';
import { ModalEditarComponent } from '../sub-components/dialogs/modal-editar/modal-editar.component';
import { DataSourceList } from '../tab-asistencia-prof-cam/data-source';
import { DialogConfirmDataAsistenciaComponent } from '../tab-asistencia/dialog/dialog-confirm-data-asistencia/dialog-confirm-data-asistencia.component';
import { dataTest } from './dataTest';
import { ContratosAdministracionService } from 'src/app/data/services/contratos/contratos-administracion.service';
import { debounceTime, of, switchMap } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'esp-crear-cabecera-asistencia-rapida',
  templateUrl: './crear-cabecera-asistencia-rapida.component.html',
  styleUrls: ['./crear-cabecera-asistencia-rapida.component.scss']
})
export class CrearCabeceraAsistenciaRapidaComponent {

  servicioControl = new FormControl();
  serviciosFiltrados: any[] = [];

  horaInicioControl = new FormControl();
  horaFin: string = '';
  horasFinOptions: { valor: string, texto: string }[] = []; // Añadido
  idServicio!: number;

  currentYear!: number;
  currentMonth!: number;
  selectedMonth!: number;
  currentDay!: number;
  selectedDay!: number;
  daysInMonth: number[] = [];

   // Variables para los campos
   sesion: number = 1; // Valor inicial para la sesión
   presupuesto: string = 'PROPIO'; // Valor inicial para el presupuesto
   modalidad: string = 'PRESENCIAL'; // Valor inicial para la modalidad
   total: number = 0; // Variable autocalculada
   
  months = [
    { name: 'Enero', value: 1 },
    { name: 'Febrero', value: 2 },
    { name: 'Marzo', value: 3 },
    { name: 'Abril', value: 4 },
    { name: 'Mayo', value: 5 },
    { name: 'Junio', value: 6 },
    { name: 'Julio', value: 7 },
    { name: 'Agosto', value: 8 },
    { name: 'Septiembre', value: 9 },
    { name: 'Octubre', value: 10 },
    { name: 'Noviembre', value: 11 },
    { name: 'Diciembre', value: 12 }
  ];

  svgDir = faArrowsUpToLine;
  
  status: RequestStatus = 'init';
  listAsistentes: any[] = [];
  opciones: Parametro[] = [];
  ctrlSearch = new FormControl('');
  ctrlSearchServicio = new FormControl('');
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

  //DATA PRUEBA
  dataPrueba: AsistenciaLista[] = [];
  dataSource: AsistenciaLista[] = [];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
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

  isMaxScroll: boolean = false;
  txtScroll: string = '';
  pageScroll: number = 1;

  codUoCiram: string = '';
  idRol!: number;

  constructor(
              private fb                                : FormBuilder,
              private router                            : Router,
              private datosService                      : DatosGeneralesService,
              private controlService                    : ControlProgramacionService,
              @Inject(LOCALE_ID) private locale         : string,
              private notificacionService               : NotificationService,
              private dialog                            : MatDialog,
              private toast                             : ToastrService,
              private cdr: ChangeDetectorRef,
              private controlProgramacionService : ControlProgramacionService,
              private renderer: Renderer2,
              private contratosAdministracionService: ContratosAdministracionService,
              private elementRef: ElementRef
            ) 
  { }

  setFocusOnFrmDoc() {
    setTimeout(() => {
      const frmDocElement = this.renderer.selectRootElement('#frmDoc', true);
      frmDocElement.focus();
    });

  }

  ngOnInit(){
    if((JSON.parse(localStorage.getItem('UnidElegida')!)).rol === 'TALLERISTA'){
      this.idRol = 7;
    }

    if((JSON.parse(localStorage.getItem('UnidElegida')!)).rol === 'PROFESIONAL CAM'){
      this.idRol = 9;
    }

    const today = new Date();
    this.currentYear = today.getFullYear();
    this.selectedMonth = today.getMonth() + 1; // Mes actual (0 indexado, por eso sumamos 1)
    this.currentMonth = today.getMonth() + 1; // Mes actual (0 indexado, por eso sumamos 1)
    this.selectedDay = today.getDate(); // Día actual
    this.currentDay = today.getDate(); // Día actual
    this.updateDaysInMonth();

    this.datosService.getFechaServidor().subscribe(data => {
      let fechaActual = new Date(data.data.fechaHoraActual);
    
      // Configurar límites
      const horaMinima = 7;  // 7 AM
      const horaMaxima = 19; // 7 PM
    
      // Obtener la hora y los minutos actuales
      let horasActuales = fechaActual.getHours();
      let minutosActuales = fechaActual.getMinutes();
    
      // Ajustar la hora de inicio si es menor que las 7 AM
      if (horasActuales < horaMinima) {
        horasActuales = horaMinima;
        minutosActuales = 0; // Ajustar los minutos a 00
      }
    
      // Hora actual en formato HH:MM
      let horaActual = `${horasActuales.toString().padStart(2, '0')}:${minutosActuales.toString().padStart(2, '0')}`;
      //alert(`Hora Actual (ajustada si es necesario): ${horaActual}`);
    
      // Sumar 45 minutos a la hora actual
      fechaActual.setHours(horasActuales);
      fechaActual.setMinutes(minutosActuales + 45);
    
      // Obtener la nueva hora después de sumar 45 minutos
      let horasFin = fechaActual.getHours();
      let minutosFin = fechaActual.getMinutes();
    
      // Ajustar la hora de fin si es mayor que las 7 PM
      if (horasFin > horaMaxima) {
        horasFin = horaMaxima;
        minutosFin = 0; // Ajustar los minutos a 00
      }
    
      // Hora final en formato HH:MM
      let horaFin = `${horasFin.toString().padStart(2, '0')}:${minutosFin.toString().padStart(2, '0')}`;
      //alert(`Hora Fin (ajustada si es necesario): ${horaFin}`);

      this.horaInicioControl.setValue(horaActual);
      this.horaFin = horaFin;
    });
    
  
    this.ctrlSearchServicio.valueChanges.pipe(
      debounceTime(300),  // Espera 300ms antes de hacer la llamada
      switchMap((value : any) => {
        if(typeof value === "string"){
          if (value && value.trim().length > 0) {
            return this.contratosAdministracionService.getListServiciosByTxtYRol(value, this.idRol);
          } else {
            return this.contratosAdministracionService.getListServiciosByTxtYRol("a", this.idRol);  // Si no hay texto, devuelve un array vacío
          }
        }
        else{
          if (value.nombre && value.nombre.trim().length > 0) {
            this.idServicio = value.idServicio;
            return this.contratosAdministracionService.getListServiciosByTxtYRol(value.nombre, this.idRol);
          } else {
            return of([]);  // Si no hay texto, devuelve un array vacío
          }
        }
       
      })
    ).subscribe(response => {
      this.esperaBusqueda = false;
      if (response && response.data) {
        this.serviciosFiltrados = response.data.slice(0, 5); // Mostrar solo los primeros 5 resultados
      } else {
        this.serviciosFiltrados = [];
      }
    });

    setTimeout(() =>{
      this.ctrlSearchServicio.setValue('a');
    })

  }

  onHoraInicioChange() {
    const horaInicio = this.horaInicioControl.value;
    if (horaInicio) {
      if (this.validarHora(horaInicio)) {
        this.generarOpcionesHoraFin(horaInicio); // Generamos las opciones de hora fin
        if (this.horasFinOptions.length > 0) {
          this.horaFin = this.horasFinOptions[0].valor; // Seleccionamos la primera opción por defecto
        } else {
          this.horaFin = ''; // No hay opciones disponibles
        }
      } else {
        this.horaInicioControl.setValue('07:00');  // Establece 7:00 a.m. si el valor no es válido
        this.generarOpcionesHoraFin('07:00');
        if (this.horasFinOptions.length > 0) {
          this.horaFin = this.horasFinOptions[0].valor;
        } else {
          this.horaFin = '';
        }
      }
    }
  }

  generarOpcionesHoraFin(horaInicio: string) {
    this.horasFinOptions = [];
    const [horaInicioH, horaInicioM] = horaInicio.split(':').map(Number);
    const inicioEnMinutos = horaInicioH * 60 + horaInicioM;

    const finMaxEnMinutos = 19 * 60; // 19:00 en minutos

    const incrementos = [45, 90, 135];

    incrementos.forEach(incremento => {
      const finEnMinutos = inicioEnMinutos + incremento;
      if (finEnMinutos <= finMaxEnMinutos) {
        const horaFinH = Math.floor(finEnMinutos / 60).toString().padStart(2, '0');
        const horaFinM = (finEnMinutos % 60).toString().padStart(2, '0');
        const valor = `${horaFinH}:${horaFinM}`;
        const texto = `${valor} - ${incremento} minutos`;
        this.horasFinOptions.push({ valor, texto });
      }
    });

    // Si no hay opciones válidas, restablecer la hora fin
    if (this.horasFinOptions.length === 0) {
      this.horaFin = '';
    }
  }

  validarHora(hora: string): boolean {
    return hora >= '07:00' && hora <= '18:15';
  }

  displayServicioFiltered(option: any): string {
    return option ? option.nombre : '';
  }

  onServicioSelect(event: any) {
    console.log('Servicio seleccionado:', event.option.value);
  }

  //SELECCIONAR DÍA
  onMonthChange(): void {
    this.updateDaysInMonth();
  }

  updateDaysInMonth(): void {
    const daysInSelectedMonth = new Date(this.currentYear, this.selectedMonth, 0).getDate();
    this.daysInMonth = Array.from({ length: daysInSelectedMonth }, (v, k) => k + 1);
  }

  getFilteredMonths() {
    return this.months;
  }

  crearClase() {

  const fecha = new Date(this.currentYear, this.selectedMonth - 1, this.selectedDay);
  const fechaFormateada = fecha.toISOString().split('T')[0]; 
    const data = {
      fecha: fechaFormateada, 
      horaInicio: this.horaInicioControl.value,
      horaFin: this.horaFin,
      idServicio: this.idServicio, 
      idunidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      idUsuario: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario,
      sesion: this.sesion, 
      modalidad: this.modalidad,
      presupuesto: this.presupuesto,
      idRol: this.idRol
    };
  
    this.contratosAdministracionService.grabarCrearClase(data).subscribe(
      (response) => {
        if(response.code == 0){
          this.toast.success("Los datos han sido actualizados");
          this.router.navigate(['/app/control/asistencia-rapida/asistencias/'+response.data.idAsisRapid])
        }
        else{
          this.toast.warning(response.message);
        }
      },
      (error) => {
        this.toast.error('Error al crear la clase.');
      }
    );
  }
 
}
