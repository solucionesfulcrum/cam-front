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
import { debounceTime, switchMap, of, forkJoin } from 'rxjs';
import { ContratosAdministracionService } from 'src/app/data/services/contratos/contratos-administracion.service';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { DataSourceList } from '../tab-asistencia-prof-cam/data-source';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'esp-editar-cabecera-asistencia-rapida',
  templateUrl: './editar-cabecera-asistencia-rapida.component.html',
  styleUrls: ['./editar-cabecera-asistencia-rapida.component.scss']
})
export class EditarCabeceraAsistenciaRapidaComponent {


  unid = JSON.parse(localStorage.getItem('UnidElegida')!);

  servicioControl = new FormControl();
  serviciosFiltrados: any[] = [];
  primeraCarga: boolean = true; // Bandera para controlar la primera ejecución

  horaInicioControl = new FormControl();
  horaFin: string = '';
  horasFinOptions: { valor: string, texto: string }[] = []; // Añadido
  idServicio!: number | null;

  listCiram: any = [];

  currentYear!: number;
  currentMonth!: number;
  selectedMonth!: number;
  currentDay!: number;
  selectedDay!: number;
  daysInMonth: number[] = [];

   // Variables para los campos
   cifra: number = 1;
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
  ctrlSearchCiram = new FormControl('');
  public formNewContrato = this.fb.nonNullable.group({
    frmSelectDoc: new FormControl(''),
    frmDoc: ['', [Validators.required, Validators.minLength(8)]],
  });
  faSpinner = faSpinner;
  comienzoSesiones = 1;
  datoProgramacion: any;

  idCiram?: number | null;
  listBusqueda: any[] = [];
  listFilteredBusqueda: any[] = [];

  statusLoadingBarra = false;
  statusLoadingData = true;
  esperaBusquedaCiram: boolean = false;

  statusLoadingSave = false;

  @ViewChild('frmDoc') frmDocElement!: ElementRef;

  public formBuscarPersona = this.fb.nonNullable.group({
    frmSelectDoc: new FormControl('1'),
    frmDoc: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
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
  columns: string[] = ['marcar',
    'orden',
    'nombreCompleto',
    'tipoDoc',
    'numDoc',
    'horaAsistencia',
    'birthday'
  ];

  fechaServidor : string = "";

  loadingPaginacion : boolean = false;

  txtBusca : string = '';

  isMaxScroll: boolean = false;
  txtScroll: string = '';
  pageScroll: number = 1;

  codUoCiram: string = '';

  idAsisRap! : number;
  denominacion : string = "";

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
  idRol!: number;
  descCifra!: string;

  constructor(
              private fb                                : FormBuilder,
              private router                            : Router,
              private route : ActivatedRoute,
              private authService:AuthService,
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

  ngOnInit() {
    // Cargar datos iniciales y luego ejecutar getDataCabecera
    forkJoin({
      fechaServidor: this.datosService.getFechaServidor(),
      listarCiram: this.authService.getListarCiram(parseInt(this.unid.idUnidOperativa))
    }).subscribe({
      next: ({ fechaServidor, listarCiram }) => {
        // Procesar la fecha del servidor
        if (fechaServidor.code === 0) {
          this.fechaServidor = fechaServidor.data.fechaHoraActual;
        }
  
        // Manejar la lista de CIRAMs
        this.esperaBusquedaCiram = false;
        this.listCiram = listarCiram.data || [];
  
        // Llamar a getDataCabecera después de completar las tareas iniciales
        this.setVariables(this.fechaServidor);
      },
      error: (err) => {
        console.error('Error en las solicitudes iniciales:', err);
        this.esperaBusquedaCiram = false;
      }
    });
  }


  setVariables(fechaSistema: string){

    if((JSON.parse(localStorage.getItem('UnidElegida')!)).idRol == 7){
      this.idRol = 7;
      this.descCifra = "Taller";
      this.denominacion = "El "+this.descCifra;
    }

    if((JSON.parse(localStorage.getItem('UnidElegida')!)).idRol == 9){
      this.idRol = 9;
      this.descCifra = "Actividad";
      this.denominacion = "La "+this.descCifra;
    }

    const today = new Date(fechaSistema);
    this.currentYear = today.getFullYear();
    this.selectedMonth = today.getMonth() + 1; // Mes actual (0 indexado, por eso sumamos 1)
    this.currentMonth = today.getMonth() + 1; // Mes actual (0 indexado, por eso sumamos 1)
    this.selectedDay = today.getDate(); // Día actual
    this.currentDay = today.getDate(); // Día actual
    this.updateDaysInMonth();
    this.getDataCabecera();
    
  
  

  }

  prepareServicioAutocomplete(){
    this.ctrlSearchServicio.valueChanges.pipe(
      debounceTime(300),  // Espera 300ms antes de hacer la llamada
      switchMap((value: any) => {
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
        this.serviciosFiltrados = response.data; // Mostrar solo los primeros 5 resultados
    
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

  getDataCabecera() {
    this.controlService.getCabeceraClaseRapida(this.idAsisRap).subscribe({
      next: (data) => {
        this.statusLoadingData = false;
  
        if (data.code === 0) {
          // Asignar datos de programación
          this.datoProgramacion = data.data;
  
          // Procesar fecha y horario
          const fecha = new Date(this.datoProgramacion.fecha);
          this.selectedDay = fecha.getUTCDate();
          this.selectedMonth = fecha.getUTCMonth() + 1;
          this.horaInicioControl.setValue(this.formatHour(this.datoProgramacion.horaIni));
  
          this.generarOpcionesHoraFin(this.formatHour(this.datoProgramacion.horaIni));
          this.horaFin = this.formatHour(this.datoProgramacion.horaFin);
  
          // Configurar valores de búsqueda
       
          this.sesion = this.datoProgramacion.sesiones;
          this.presupuesto = this.datoProgramacion.presupuesto;
          this.modalidad = this.datoProgramacion.modalidad;
          this.codUoCiram = '';
          this.cifra = this.datoProgramacion.nroCifra;

          this.prepareServicioAutocomplete();
          this.ctrlSearchServicio.setValue(this.datoProgramacion.nombreServicio);
  
          // Preselección de CIRAM
          if (this.datoProgramacion.esCiram) {
            this.idCiram = this.datoProgramacion.idUnidadOperativa;
  
            // Buscar el CIRAM correspondiente en la lista y asignarlo
            const ciramPreseleccionado = this.listCiram.find(
              (ciram: any) => ciram.idUnidadOperativa === this.idCiram
            );
            if (ciramPreseleccionado) {
              this.ctrlSearchCiram.setValue(ciramPreseleccionado);
            } else {
              this.ctrlSearchCiram.setValue(String(this.idCiram)); // Fallback
            }
          }
  
          // Configurar descripción basada en el rol
          if (this.datoProgramacion.idRol === 7) {
            this.descCifra = 'Nro de Taller';
          } else if (this.datoProgramacion.idRol === 9) {
            this.descCifra = 'Nro de Actividad';
          }
        } else {
          this.notificacionService.warning(data.message);
        }
      },
      error: (err) => {
        console.error('Error al cargar la cabecera:', err);
        this.statusLoadingData = false;
      }
    });
  }

    // Función para formatear la hora asegurando que las horas menores a 10 tengan un cero inicial
  formatHour(hour: string): string {
    const [h, m] = hour.split(':'); // Separar la hora y los minutos
    return `${h.padStart(2, '0')}:${m}`; // Asegurar que la hora tenga dos dígitos
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
    if (!option) {
     // console.warn('displayServicioFiltered recibió un valor no definido:', option);
      return ''; // Retorna una cadena vacía si option es undefined o null
    }
  
    if (typeof option === 'string') {
    // console.log('displayServicioFiltered recibió una cadena:', option);
      return option; // Si es una cadena, simplemente retorna el valor
    }
  
   // console.log('displayServicioFiltered recibió un objeto válido:', option);
    return option.nombre || ''; // Si es un objeto, retorna la propiedad `nombre` o una cadena vacía si no existe
  }

  onServicioSelect(event: any) {
    console.log('Servicio seleccionado:', event.option.value);
  }

  onCiramSelected(event: any) {
    this.idCiram = event.option.value.idUnidadOperativa;
  }

   // Mostrar nombre en el autocomplete
   displayCiram(ciram: any): string {
    return ciram ? ciram.nombre : '';
  }

  // Limpiar el valor

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
    this.statusLoadingSave = true;
  
    // Obtener la fecha y formatearla
    const fecha = new Date(this.currentYear, this.selectedMonth - 1, this.selectedDay);
    const fechaFormateada = fecha.toISOString().split('T')[0];
  
    // Verificar los valores requeridos
    if (!this.idServicio) {
      this.toast.warning('Debe ingresar el servicio');
      this.statusLoadingSave = false;
      return; // Detener la ejecución si no hay idServicio
    }
  
    if (this.sesion <= 0) {
      this.toast.warning('El número de la sesión debe ser un número mayor que 0');
      this.statusLoadingSave = false;
      return; // Detener la ejecución si la sesión no es válida
    }
  
    // Lógica para ajustar las horas si están fuera del rango permitido
    const horaMinima = '08:00'; // 8:00 AM
    const horaMaxima = 19; // 7 PM (19:00)
    const horaFija = '18:15'; // 6:15 PM
  
    let horaInicio = this.datoProgramacion.horaIni;
    let horaFin = this.datoProgramacion.horaFin;
  
    const [horaInicioH, horaInicioM] = horaInicio.split(':').map(Number);
    const [horaFinH, horaFinM] = horaFin.split(':').map(Number);
  
    // Ajustar hora de inicio si es antes de 8:00 AM
    if (horaInicioH < 8 || (horaInicioH === 8 && horaInicioM < 0)) {
      horaInicio = horaMinima;
    }
  
    // Ajustar hora de inicio si supera el límite de las 7 PM
    if (horaInicioH >= horaMaxima) {
      horaInicio = horaFija;
    }
  
    // Ajustar hora de fin si supera el límite de las 7 PM
    if (horaFinH >= horaMaxima) {
      const [horaFijaH, horaFijaM] = horaFija.split(':').map(Number);
      const fechaHoraFin = new Date(fecha);
      fechaHoraFin.setHours(horaFijaH, horaFijaM + 45);
      horaFin = `${fechaHoraFin.getHours().toString().padStart(2, '0')}:${fechaHoraFin.getMinutes().toString().padStart(2, '0')}`;
    }

    let idunidadOperativa;

    if(this.idCiram){
      idunidadOperativa = this.idCiram
    }
    else{
      idunidadOperativa = JSON.parse(localStorage.getItem('UnidElegida')!).idUnidOperativa
    }
  
    // Preparar el objeto de datos para enviar al servicio
    const data = {
      fecha: fechaFormateada,
      horaInicio: "00:00", //horaInicio 2024-11-25 00:00
      horaFin: "00:00", //horaFin
      idServicio: this.idServicio,
      idunidadOperativa: idunidadOperativa,
      idUsuario: JSON.parse(localStorage.getItem('camUser')!).idUsuario,
      sesion: this.sesion,
      nroCifra: this.cifra,
      modalidad: this.modalidad,
      presupuesto: this.presupuesto
    };
  
    // Llamada al servicio para actualizar la clase
    this.contratosAdministracionService.actualizarClase(this.datoProgramacion.idAsisRapido, data).subscribe(
      (response) => {
        if (response.code == 0) {
          this.toast.success('Los datos han sido actualizados');
          this.router.navigate(['/app/control/asistencia-rapida/asistencias/' + response.data.idAsisRapid]);
        } else {
          this.toast.warning(response.message);
        }
      },
      (error) => {
        this.statusLoadingSave = false;
        this.toast.error('Error al crear la clase.');
      }
    );
  }

  clearServicioValue() {
    this.ctrlSearchServicio.setValue('');
    this.idServicio = null;
  }

  clearCiramValue() {
    this.ctrlSearchCiram.setValue('');
    this.idCiram = null;
  }
  
  
}
