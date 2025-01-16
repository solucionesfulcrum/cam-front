import { Component, HostListener } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { RequestRolServicios } from '@models/control/asistencia/service-asistencia.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { imprimirRequestTalleresTallerista, ReportesTalleristaPayload } from '@models/reportes/reportes-tallerista';
import { RolServicios } from '@models/rol/rol-data.model';
import { NotificationService } from '@services/notification.service';
import { RolService } from '@services/rol.service';
import { ModalConfirmarGenericoComponent } from '@shared/components/modal-confirmar-generico/modal-confirmar-generico.component';
import { ParamMenu } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, of, switchMap } from 'rxjs';
import { ContratosAdministracionService } from 'src/app/data/services/contratos/contratos-administracion.service';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ProgramacionContratosService } from 'src/app/data/services/programacion/programacion-contratos.service';
import { ReportesTalleristaService } from 'src/app/data/services/reportes/reportes-tallerista.service';
import { ModalConfirmarComponent } from 'src/app/pages/control/components/sub-components/dialogs/modal-confirmar/modal-confirmar.component';

@Component({
  selector: 'esp-lista-servicios-rol',
  templateUrl: './lista-servicios-rol.component.html',
  styleUrls: ['./lista-servicios-rol.component.scss']
})
export class ListaServiciosRolComponent {

  ctrlSearchServicio = new FormControl('');
  esperaBusqueda: boolean = false;
  serviciosFiltrados: any[] = [];
  idServicio!: number;

  opciones: Parametro[] = [];

  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
  });

  dataAcciones: ParamMenu[] = [
   /* {texto: 'Descargar Excel', svgDir: 'assets/svg/icon-excel.svg'}*/
  ];

  dataSource: RolServicios[] = [];
  columns: string[] = [
    'marcar',
    'descripcion',
  ];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 100;
  pageSizeOptions:  number[] = [5,10,20,100];
  total = 0;

  loadingData : boolean = false;

  seleccionados : number[] = [];

  idRol!: number;
  dropdownOpen: boolean = false;
  
  constructor(
    private fb                      : FormBuilder,
    private programacionService     : ProgramacionContratosService,
    private datosService             : DatosGeneralesService,
    private notificationService     : NotificationService,
    private reportService : ReportesTalleristaService,
    private rolService:RolService,
    private controlServ : ControlProgramacionService,
    private contratosAdministracionService: ContratosAdministracionService,
    private toast: ToastrService,
    
    private dialog: MatDialog,
    private router : Router,
    private route : ActivatedRoute,
) { 
  this.route.params.subscribe(params => {
    this.idRol = params['roleId']; 
  });

}

ngOnInit(){
  this.datosService.getTipoParametros('ESTADO_CONTROL_ASISTENCIA').subscribe((data)=>{
    if (data.code == 0) {
      this.opciones = data.data.map(filtro => {
        return {...filtro, idParametros : parseInt(filtro.valor1)}
      });
    }
    else{
      this.notificationService.warning(data.message);
    }
  });

  this.ctrlSearchServicio.valueChanges.pipe(
    debounceTime(300),  // Espera 300ms antes de hacer la llamada
    switchMap((value : any) => {
      if(typeof value === "string"){
        if (value && value.trim().length > 0) {
          return this.contratosAdministracionService.getListServiciosAll(value);
        } else {
          return this.contratosAdministracionService.getListServiciosAll("a");  // Si no hay texto, devuelve un array vacío
        }
      }
      else{
        if (value.nombre && value.nombre.trim().length > 0) {
          this.idServicio = value.idServicio;
          return this.contratosAdministracionService.getListServiciosAll(value.nombre);
        } else {
          return of([]);  // Si no hay texto, devuelve un array vacío
        }
      }
     
    })
  ).subscribe(response => {
    this.esperaBusqueda = false;
    if (response && response.data) {
      this.serviciosFiltrados = response.data.slice(0, 10); // Mostrar solo los primeros 5 resultados
    } else {
      this.serviciosFiltrados = [];
    }
  });

  setTimeout(() =>{
    this.ctrlSearchServicio.setValue('a');
  })

  this.loadData();
}

displayServicioFiltered(option: any): string {
  return option ? option.nombre : '';
}

onServicioSelect(event: any) {
  let idServicio = event.option.value.idServicio;
  this.rolService.agregarServiciosRol([
    {idServicio: idServicio, idRol: this.idRol}
  ]).subscribe(data => {
    if(data.code == 0){
      this.toast.success("Se ha agregado un nuevo servicio al Rol");
      this.ctrlSearchServicio.setValue("");
      this.loadData();
      this.seleccionados = [];
    }
    else{
      this.toast.error("Ocurrió un error agregando los servicios");
    }
  })
}


loadData(){

  setTimeout(() => {
    this.loadingData = true;
    let metodo = this.rolService.getServiciosDelRol(this.idRol);
    metodo.subscribe((data)=>{
      this.loadingData = false;
      if (data.code == 0) {
        this.dataSource = data.data;
        this.pageNum = 1;
        this.total = data.data.length;
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  });
  
}



afectarTodo(evento: Event): void{
  let element = evento.target as HTMLInputElement;
  this.dataSource = this.dataSource.map(data => { return {...data, marcar: Boolean(element.checked)}});
  if(element.checked)
    this.seleccionados =  this.dataSource.map(data => { return data.idServicioRol});
  else
    this.seleccionados = [];
}




getPayloadList(): RequestRolServicios{
 
  return {
    idRol: JSON.parse(localStorage.getItem("UnidElegida")!).idUnidOperativa,
    texto: "",
  };
}



seleccionarFila(evento: Event) {
  let element = evento.target as HTMLInputElement;
  if(element.checked)
    this.seleccionados.push(parseInt(element.value))
  else
    this.seleccionados = this.seleccionados.filter(item => item != parseInt(element.value));

}

  
formatDate(dateString : string) {
  // Divide la cadena en partes usando el separador '-'
  const parts = dateString.split('-');
  // Reorganiza las partes en el formato 'DD/MM/YYYY'
  const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
  return formattedDate;
}

transformarHora(hora24 : string) {
  // Dividimos la hora y los minutos
  const [hora, minutos] = hora24.split(':').map(Number);

  // Determinamos si es AM o PM
  const periodo = hora >= 12 ? 'PM' : 'AM';

  // Convertimos la hora al formato de 12 horas
  const hora12 = hora % 12 || 12;

  // Formateamos la hora y los minutos con dos dígitos
  const hora12Str = hora12.toString().padStart(2, '0');
  const minutosStr = minutos.toString().padStart(2, '0');

  // Retornamos la hora en el nuevo formato
  return `${hora12Str}:${minutosStr} ${periodo}`;
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

eliminaSeleccionados(evento : Event) : void{
  const dialog = this.dialog.open(ModalConfirmarGenericoComponent,{
    data:{
      message: '¿Seguro de eliminar los servicios seleccionados de este rol?'
    },
    width: "30%"
  });

  dialog.afterClosed().subscribe((result : {success: boolean}) => {
    if(result.success){
      this.eliminarServiciosRol();
    }
  });
}

eliminarServiciosRol(){
  let asistentesEliminar: number[] = this.dataSource
  .filter((asistente: RolServicios) => this.seleccionados.includes(asistente.idServicioRol))
  .map((asistente: RolServicios) => asistente.idServicioRol as number);

  ////console.log(asistentesEliminar);
  this.rolService.eliminarServiciosRol(asistentesEliminar).subscribe(data=>{
    if(data.code == 0){
      this.toast.success("Los registros han sido eliminados");
      this.loadData();
      this.seleccionados = [];
    }
    else{
      this.toast.error("Ocurrió un error eliminando los registros");
    }
  })
}
}
