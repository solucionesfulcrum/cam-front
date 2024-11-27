import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ItemListaAsistenciaRapida } from '@models/control/asistencia-rapida/asistencia-rapida';
import { Parametro } from '@models/parametros-busqueda.model';
import { imprimirRequestTalleresTallerista, ReportesTalleristaPayload } from '@models/reportes/reportes-tallerista';
import { NotificationService } from '@services/notification.service';
import { ModalConfirmarGenericoComponent } from '@shared/components/modal-confirmar-generico/modal-confirmar-generico.component';
import { ParamMenu } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ProgramacionContratosService } from 'src/app/data/services/programacion/programacion-contratos.service';
import { ReportesTalleristaService } from 'src/app/data/services/reportes/reportes-tallerista.service';

@Component({
  selector: 'esp-asistencia-rapida-lista',
  templateUrl: './asistencia-rapida-lista.component.html',
  styleUrls: ['./asistencia-rapida-lista.component.scss']
})
export class AsistenciaRapidaListaComponent {
  opciones: Parametro[] = [];

  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
  });

  dataAcciones: ParamMenu[] = [
   /* {texto: 'Descargar Excel', svgDir: 'assets/svg/icon-excel.svg'}*/
  ];

  idRol!: number;

  dataSource: any[] = [];
  columns: string[] = [
    'marcar',
    'descripcion',
    'modalidad',
    'presupuesto',
    'fecha',
    'sesiones',
    'nroCifra',
    'estado',
  ];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;

  loadingData : boolean = false;

  seleccionados : number[] = [];
  
  constructor(
    private fb                      : FormBuilder,
    private programacionService     : ProgramacionContratosService,
    private datosService             : DatosGeneralesService,
    private notificationService     : NotificationService,
    private reportService : ReportesTalleristaService,
    private controlServ : ControlProgramacionService,
    private dialog: MatDialog,
    private router : Router
) { }

ngOnInit(){
  if((JSON.parse(localStorage.getItem('UnidElegida')!)).rol === 'TALLERISTA'){
    this.idRol = 7;
  }

  if((JSON.parse(localStorage.getItem('UnidElegida')!)).rol === 'PROFESIONAL CAM'){
    this.idRol = 9;

    this.columns = [
      'marcar',
      'descripcion',
      'modalidad',
      'presupuesto',
      'fecha',
      'sesiones',
      'nroCifra',
      'ciram',
      'estado',
      'opciones'
    ];
  }

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
  this.loadData();
}

loadData(){

  setTimeout(() => {
    this.loadingData = true;
    let metodo;
    if(this.idRol == 7){
      metodo = this.controlServ.getDataAsistenciaRapida(this.getPayloadList());
    }
    else{
      metodo = this.controlServ.getDataAsistenciaRapidaProfesionalCam(this.getPayloadList());
    }
    metodo.subscribe((data)=>{
      this.loadingData = false;
      if (data.code == 0) {
        this.dataSource = data.data.list;
        this.pageNum = data.data.pageNum;
        this.total = data.data.total;
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

 /* const today = new Date();
  const day = String(today.getDate()).padStart(2, '0'); // Día con dos dígitos
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos
  const year = today.getFullYear();
  var fechaSinFormatFin = `${day}/${month}/${year}`;
  var fechaSinFormatInit = '01/01/2023';*/

   // var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
  //var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
  
  fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
  fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;
  fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
  fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;
  var idUnidOpe = JSON.parse(localStorage.getItem("UnidElegida")!);

  let payload: imprimirRequestTalleresTallerista = {
    idUnidadOperativa: JSON.parse(localStorage.getItem("UnidElegida")!).idUnidOperativa,
    idUsuario: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario,
    texto: this.formBuscar.controls['frmSearch'].value,
    fecInicio: fecInicio,
    fecFin: fecFin,
    estado: this.formBuscar.get('frmSearchEstado')?.value,
    pageNum: this.pageNum,
    pageSize: this.pageSize
  };

  let metodo;
  if(JSON.parse(localStorage.getItem("UnidElegida")!).tipo == "CIRAM"){
    metodo = this.reportService.getExcelTalleresTalleristaCiram(payload);
  }
  else{
    metodo = this.reportService.getExcelTalleresTallerista(payload);
  }

  metodo.subscribe((data)=>{
    this.notificationService.success('Se esta descargando el reporte');
    const blob: Blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = 'Reporte_Talleres_Del_Tallerista.xlsx';
    anchor.href = url;
    anchor.click();
    window.URL.revokeObjectURL(url);
  })

}


getPayloadList(): ReportesTalleristaPayload{
  var fecInicio: any;
  var fecFin: any;

  var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
  var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];

 /* const today = new Date();
  const day = String(today.getDate()).padStart(2, '0'); // Día con dos dígitos
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos
  const year = today.getFullYear();
  var fechaSinFormatFin = `${day}/${month}/${year}`;
  var fechaSinFormatInit = '01/01/2023';*/

   // var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
  //var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
  
  fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
  fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;

  return {
    idUnidadOperativa: JSON.parse(localStorage.getItem("UnidElegida")!).idUnidOperativa,
    idUsuario: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario,
    texto: this.formBuscar.controls['frmSearch'].value,
    fecInicio: fecInicio,
    fecFin: fecFin,
    estado: this.formBuscar.get('frmSearchEstado')?.value,
    pageNum: this.pageNum,
    pageSize: this.pageSize,
    idRol: this.idRol
  }
}

handlePageEvent(event: PageEvent) {
  this.pageSize = event.pageSize;
  this.pageIndex = event.pageIndex;
  this.pageNum = event.pageIndex + 1;
  this.loadData();
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

editar(row: ItemListaAsistenciaRapida): void {
  if(row.estado == "ABIERTO"){
    this.router.navigate(['/app/control/asistencia-rapida/editar-cabecera/'+row.idAsisRapido])
  }
  else{
    this.dialog.open(ModalConfirmarGenericoComponent, {
      data:{
        message: '¿Desea modificar el estado de la asistencia rápida finalizada?'
      }
    }).afterClosed().subscribe(data=>{
      if(data.success){
       this.controlServ.reactivarAsistenciaRapida(row.idAsisRapido).subscribe((data)=>{
        if(data.code == 0){
            this.router.navigate(['/app/control/asistencia-rapida/editar-cabecera/'+row.idAsisRapido])
        }
        else{
            this.notificationService.warning(data.message);
        }
       })
      }
    });
  }
}

eliminar(row: ItemListaAsistenciaRapida): void {
  this.dialog.open(ModalConfirmarGenericoComponent, {
    data:{
      message: '¿Desea eliminar la asistencia rápida?'
    }
  }).afterClosed().subscribe(data=>{
    if(data.success){
     this.controlServ.desactivaAsistenciaRapida(row.idAsisRapido).subscribe((data)=>{
      if(data.code == 0){
        this.notificationService.success(data.message);
        this.loadData();
      }
      else{
          this.notificationService.warning(data.message);
      }
     })
    }
  });
}

  irAAsistencia(){
    this.router.navigate(['/app/control/asistencia-rapida/crear-cabecera'])
  }
}
