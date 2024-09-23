import { ChangeDetectorRef, Component, ElementRef, Inject, LOCALE_ID, Renderer2, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowsUpToLine, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AsistenciaLista } from '@models/control/asistencia/crud-asistencia.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, switchMap, of } from 'rxjs';
import { ContratosAdministracionService } from 'src/app/data/services/contratos/contratos-administracion.service';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { DataSourceList } from '../tab-asistencia-prof-cam/data-source';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'esp-editar-cabecera-asistencia-rapida',
  templateUrl: './editar-cabecera-asistencia-rapida.component.html',
  styleUrls: ['./editar-cabecera-asistencia-rapida.component.scss']
})
export class EditarCabeceraAsistenciaRapidaComponent {

  

  servicioControl = new FormControl();
  serviciosFiltrados: any[] = [];
  primeraCarga: boolean = true; // Bandera para controlar la primera ejecución

  horaInicioControl = new FormControl();
  horaFin: string = '';
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
  statusLoadingData = true;

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

  idAsisRap! : number;

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
              private fb                                : FormBuilder,
              private router                            : Router,
              private route : ActivatedRoute,
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
  {
    this.idAsisRap = parseInt(this.route.snapshot.paramMap.get('idAsisRap')!);
   }

  setFocusOnFrmDoc() {
    setTimeout(() => {
      const frmDocElement = this.renderer.selectRootElement('#frmDoc', true);
      frmDocElement.focus();
    });

  }

  ngOnInit(){

    const today = new Date();
    this.currentYear = today.getFullYear();
    this.selectedMonth = today.getMonth() + 1; // Mes actual (0 indexado, por eso sumamos 1)
    this.currentMonth = today.getMonth() + 1; // Mes actual (0 indexado, por eso sumamos 1)
    this.selectedDay = today.getDate(); // Día actual
    this.currentDay = today.getDate(); // Día actual
    this.updateDaysInMonth();
    this.getDataCabecera();
    
  
    this.ctrlSearchServicio.valueChanges.pipe(
      debounceTime(300),  // Espera 300ms antes de hacer la llamada
      switchMap((value: any) => {
        if (typeof value === "string") {
          if (value && value.trim().length > 0) {
            return this.contratosAdministracionService.getListServiciosByTxt(value);
          } else {
            return this.contratosAdministracionService.getListServiciosByTxt("a");  // Si no hay texto, devuelve una lista predeterminada
          }
        } else {
          if (value.nombre && value.nombre.trim().length > 0) {
            this.idServicio = value.idServicio;
            return this.contratosAdministracionService.getListServiciosByTxt(value.nombre);
          } else {
            return of([]);  // Si no hay texto, devuelve un array vacío
          }
        }
      })
    ).subscribe(response => {
      this.esperaBusqueda = false;
      if (response && response.data) {
        this.serviciosFiltrados = response.data.slice(0, 5); // Mostrar solo los primeros 5 resultados
    
        // Seleccionar automáticamente el primer valor si existe
        if (this.primeraCarga && this.serviciosFiltrados.length > 0) {
          const primerServicio = this.serviciosFiltrados[0];
          this.ctrlSearchServicio.setValue(primerServicio);  // Asigna el primer valor al FormControl
          this.primeraCarga = false;  // Marcar que la primera carga ya ocurrió
        }
      } else {
        this.serviciosFiltrados = [];
      }
    });

  }

  getDataCabecera(){
    this.controlService.getCabeceraClaseRapida(this.idAsisRap).subscribe((data)=>{
      this.statusLoadingData = false;
      if (data.code == 0) {
        this.datoProgramacion = data.data;

        const fecha = new Date(this.datoProgramacion.fecha);
        this.selectedDay = fecha.getUTCDate();
        this.selectedMonth = fecha.getUTCMonth() + 1;
        this.horaInicioControl.setValue(this.datoProgramacion.horaIni);
        this.horaFin = this.datoProgramacion.horaFin;
        this.ctrlSearchServicio.setValue(this.datoProgramacion.nombreServicio)
        this.sesion=this.datoProgramacion.sesiones
        this.presupuesto=this.datoProgramacion.presupuesto
        this.modalidad=this.datoProgramacion.modalidad
        this.codUoCiram = "";
        ////console.log(Math.floor(seconds/(60*60)) + 'h ' +  Math.floor(seconds/60) + ' m')
      }
      else{
        this.notificacionService.warning(data.message);
      }
    })
  }

  onHoraInicioChange() {
    const horaInicio = this.horaInicioControl.value;
    if (horaInicio) {
      if (this.validarHora(horaInicio)) {
        this.horaFin = this.calcularHoraFin(horaInicio);
        if (this.horaFin > '18:15') {
          this.horaFin = '18:15';  // Ajusta la hora de fin a 6:15 p.m. si excede
        }
      } else {
        this.horaInicioControl.setValue('07:00');  // Establece 7:00 a.m. si el valor no es válido
        this.horaFin = this.calcularHoraFin('07:00');
      }
    }
  }

  calcularHoraFin(horaInicio: string): string {
    const [hora, minutos] = horaInicio.split(':').map(Number);
    const fecha = new Date();
    fecha.setHours(hora, minutos);
    fecha.setMinutes(fecha.getMinutes() + 45);  // Añadir 45 minutos

    // Formatear la hora de fin a HH:MM
    const horaFin = fecha.getHours().toString().padStart(2, '0');
    const minutosFin = fecha.getMinutes().toString().padStart(2, '0');
    return `${horaFin}:${minutosFin}`;
  }

  validarHora(hora: string): boolean {
    // Verifica que la hora esté en el rango de 07:00 a 18:15
    return hora >= '07:00' && hora <= '18:15';
  }

  displayServicioFiltered(option: any): string {
    return option ? option.nombre : '';
  }

  onServicioSelect(event: any) {
    console.log('Servicio seleccionado:', event.option.value);
  }

  //SELECCIONAR DIA
  onMonthChange(): void {
    this.updateDaysInMonth();
  }

  updateDaysInMonth(): void {
    const daysInSelectedMonth = new Date(this.currentYear, this.selectedMonth, 0).getDate();
    const today = new Date();
    this.daysInMonth = Array.from({ length: daysInSelectedMonth }, (v, k) => k + 1);
    // Calcular la fecha de hace 7 días
    /*const oneWeekBefore = new Date();
    oneWeekBefore.setDate(today.getDate() - 7); 
  
    // Si el mes seleccionado es el mes actual
    if (this.selectedMonth === this.currentMonth) {
      // Si la fecha actual es menor al primer día del mes, empieza desde el primer día
      const startDay = Math.max(1, oneWeekBefore.getDate());
      this.daysInMonth = Array.from({ length: daysInSelectedMonth - startDay + 1 }, (v, k) => k + startDay);
    } else {
      // Si es un mes diferente, incluir todos los días del mes
      this.daysInMonth = Array.from({ length: daysInSelectedMonth }, (v, k) => k + 1);
    }*/
  }
  

  getFilteredMonths() {
    // Filtra solo meses desde el mes actual hacia adelante
   // return this.months.filter(month => month.value >= this.currentMonth);
   return this.months
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
      presupuesto: this.presupuesto 
    };
    
    this.contratosAdministracionService.actualizarClase(this.datoProgramacion.idAsisRapido, data).subscribe(
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
