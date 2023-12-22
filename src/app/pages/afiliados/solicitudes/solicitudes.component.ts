import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { AuthService } from '../../auth/services/auth-service.service';
import { Parametro } from 'src/app/shared/components/opciones-busqueda/parametros-busqueda.model';
import { Dialog } from '@angular/cdk/dialog';
import { AfiliadoService } from '@shared/services/afiliado.service';
import { fichasResponse } from '@models/ficha-solicitud.model';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { RequestListaSolicitudesAfiliados } from '@models/afiliados/ficha-solicitud.model';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  optEstados: Parametro[] = [
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

  // displayedColumns: string[] = [
  //   'selecc',
  //   'usuario',
  //   'tipodoc',
  //   'nombres',
  //   'edad',
  //   'estcivil',
  //   'ipress',
  //   'tieneVigencia',
  // ];

  // breadcrum1:{url:string, title:string }   
  // breadcrum2:{url:string, title:string } 
  // breadcrum3:{url:string, title:string } 

  // dataSource: MatTableDataSource<any>;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder, 
    private afiliacionesService: AfiliacionesSolicitudesService,
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private authService: AuthService,
    private dialog : Dialog,
    private afiliadoService: AfiliadoService

  ) {
    // breadcrumService.link1$.next({ url: '/afiliados/solicitudes', title:'SOLICITUDES' });
    // this.breadcrumService.link2$.next({url:'' ,title:''});
    // this.breadcrumService.link3$.next({url:'', title:''});
    // breadcrumService.activeTab$.next('/afiliados/solicitudes');
    // // // // this.loadUsers()
   }

  ngOnInit(): void {
    this.onLoadData()
  }

  onLoadData(){
    this.afiliacionesService.getListaSolicitudes(this.getPayload()).subscribe((data)=>{
      this.dataSource = data;
      this.total = this.dataSource.length;
      console.log(data)
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

    if (this.formBuscar.value.frmSearchDate == '') {
      fecInicio = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()-1}`;
      fecFin = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`;
    }
    else{
      fecInicio = this.formBuscar.value.frmSearchDate.split(' - ')[0];
      fecFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
    }

    return {
      tipoSolicitud: 'SOLICITUD_AFILIACION',
      unidadOperativa: 3,
      fechaInicio: fecInicio,
      fechaFin: fecFin,
      buscar: this.formBuscar.controls['frmSearch'].value
    }
  }

  getEdad(fecha: string): number{
    let fecNac = new Date(parseInt(fecha.split('/')[2]), parseInt(fecha.split('/')[1]) - 1, parseInt(fecha.split('/')[0]));
    var timeDiff = Math.abs(Date.now() - fecNac.getTime());
    let edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);

    return edadPersona
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








