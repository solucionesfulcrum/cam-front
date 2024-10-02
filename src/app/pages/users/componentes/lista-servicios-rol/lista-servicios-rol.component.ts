import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { RequestRolServicios } from '@models/control/asistencia/service-asistencia.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { imprimirRequestTalleresTallerista, ReportesTalleristaPayload } from '@models/reportes/reportes-tallerista';
import { NotificationService } from '@services/notification.service';
import { RolService } from '@services/rol.service';
import { ParamMenu } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import { debounceTime, of, switchMap } from 'rxjs';
import { ContratosAdministracionService } from 'src/app/data/services/contratos/contratos-administracion.service';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ProgramacionContratosService } from 'src/app/data/services/programacion/programacion-contratos.service';
import { ReportesTalleristaService } from 'src/app/data/services/reportes/reportes-tallerista.service';

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

  dataSource: any[] = [];
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
  
  constructor(
    private fb                      : FormBuilder,
    private programacionService     : ProgramacionContratosService,
    private datosService             : DatosGeneralesService,
    private notificationService     : NotificationService,
    private reportService : ReportesTalleristaService,
    private rolService:RolService,
    private controlServ : ControlProgramacionService,
    private contratosAdministracionService: ContratosAdministracionService,
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
      this.serviciosFiltrados = response.data.slice(0, 5); // Mostrar solo los primeros 5 resultados
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
  console.log('Servicio seleccionado:', event.option.value);
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
    this.seleccionados =  this.dataSource.map(data => { return data.idInscripcion});
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

  irAAsistencia(){
    this.router.navigate(['/app/control/asistencia-rapida/crear-cabecera'])
  }
}
