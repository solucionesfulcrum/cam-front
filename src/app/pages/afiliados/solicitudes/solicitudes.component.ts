import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Parametro } from 'src/app/shared/components/opciones-busqueda/parametros-busqueda.model';
import { Dialog } from '@angular/cdk/dialog';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { RequestListaSolicitudesAfiliados } from '@models/afiliados/ficha-solicitud.model';
import { NotificationService } from '@services/notification.service';
import { DialogNewAseguradoComponent } from '../../contactos/components/contactos-afiliados/sub-components/dialog/dialog-new-asegurado/dialog-new-asegurado.component';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  optEstados: any[] = [
    {nombre:'Disponibles', valor1:'01'},
    {nombre:'Suspendidos', valor1:'02'},
    {nombre:'No Disponibles', valor1:'03'}
  ];

  filtroFecInit!: string;
  filtroFecFin!: string;
  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
  });
  // Esta data debe ser reemplazada por lo que se obtiene del servicio -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  dataPrueba: any[] = [];
  dataSource: any[] = [];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;
  columns: string[] = ['marcar','nombres','tipoDoc','numDoc', 'edad', 'estadoCivil','ipress','fecha'];
  // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

 /* 
  filtroFecInit!: string;
  filtroFecFin!: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = {} as MatPaginator;
  // dataSource!: MatTableDataSource<any>;
  // @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild(MatPaginator) paginator2!: MatPaginator;
  dataSource: fichasResponse[] = [];
  // dataSourceRespaldo: fichasResponse[] = [];

  columns: string[] = ['numHistClinica','fullName', 'documento', 'dni', 'date','status'];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:number[] = [5,10,20];
  total = 0;

  opciones: Parametro[] = [];
 
  form:FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
  });

*/ 


  form= this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });


  constructor(
    private fb: FormBuilder, 
    private afiliacionesService: AfiliacionesSolicitudesService,
    private dialog                  : Dialog,
    private notificationService: NotificationService,
    private router: Router, 
    private route: ActivatedRoute,
  ) {
   }

  ngOnInit(): void {
    this.onLoadData()
  }

  onLoadData(){
    // this.dataSource = [
    //   {nombres: 'ROXANA ESTRADA ARIAS', tipoDoc: 1, numDoc: '23835688', fecNac: '16/03/1968', estCivil: 'SOLTERA', ipress: 'EUNICE ELIZABETH', dias: 3}
    // ]
    // this.total = 1;
    console.log(this.getPayload())
    this.afiliacionesService.getListaSolicitudes(this.getPayload()).subscribe((data)=>{
      if (data.code == 0) {
        console.log(data.data)
        this.dataSource = data.data.list;
        this.pageNum = data.data.pageNum;
        this.pageSize = data.data.pageSize;
        this.total = data.data.total;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }
  
  getDataFecha(value: any){
    this.formBuscar.get('frmSearchDate')?.setValue(value);
    this.onLoadData();
  }

  handlePageEvent(event: PageEvent) {
    // console.log(this.pageSizeOptions);
    console.log(event)
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.onLoadData();
  }

  getPayload(): RequestListaSolicitudesAfiliados{
    var fecInicio: any;
    var fecFin: any;
    var idUnidOpe = JSON.parse(localStorage.getItem("UnidElegida")!);

    if (this.formBuscar.value.frmSearchDate == '') {
      fecInicio = `${new Date().getFullYear()}-1-1`;
      fecFin = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
    }
    else{
      var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
      var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
      fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
      fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;
    }

    return {
      idUnidOpeCam: idUnidOpe.idUnidOperativa,
      texto: this.formBuscar.controls['frmSearch'].value,
      fecInicio: fecInicio,
      fecFin: fecFin,
      pageNum: this.pageNum.toString(),
      pageSize: this.pageSize.toString(),
      estado: 0
    }
  }

  getEdad(fecha: string): number{
    let fecNac = new Date(parseInt(fecha.split('/')[2]), parseInt(fecha.split('/')[1]) - 1, parseInt(fecha.split('/')[0]));
    var timeDiff = Math.abs(Date.now() - fecNac.getTime());
    let edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);

    return edadPersona
  }

  differenceInDays(date1: string): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffInTime = (new Date().getTime()) - (new Date(date1)).getTime();
    return Math.round(diffInTime / oneDay) - 1;
}

nuevoAsegurado(){
  const dialogRef = this.dialog.open(DialogNewAseguradoComponent,{
    minWidth:'800px',
    maxWidth:'50%',
    data:{}
  })
  dialogRef.closed.subscribe(out =>{
    // console.log(out)
  })
}
  /*
  AsignarFiltro(filtro: string){
    this.form.get('frmSearchDate')?.setValue(filtro);
    var init = filtro.split(' - ')[0];
    var fin = filtro.split(' - ')[1];
    this.filtroFecInit = init.split('/')[2]+'-'+init.split('/')[1]+'-'+init.split('/')[0];
    this.filtroFecFin = fin.split('/')[2]+'-'+fin.split('/')[1]+'-'+fin.split('/')[0];
    this.onLoadData();
  }
  */
}








