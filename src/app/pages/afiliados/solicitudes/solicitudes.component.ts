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

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder, 
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
    var fecInicio: any;
    var fecFin: any;

    if (this.formBuscar.value.frmSearchDate == '') {
      fecInicio = new Date();
      fecInicio.setMonth(fecInicio.getMonth()-24);
      fecInicio = fecInicio.toJSON().split('T')[0];
      fecFin = new Date().toJSON().split('T')[0];
    }
    else{
      fecInicio = this.filtroFecInit;
      fecFin = this.filtroFecFin;
    }

    // Aca debe ponerse el servicio a llamar para controlar la lista de la página, en caso de controlar la paginación mediante el servicio------------------------------------------------------------------------------------------------------------
    this.dataPrueba = [
      {nombre: 'ROXANA ESTRADA ARIAS', tipoDoc: 'DNI', numDoc: '23835688', edad: 75, estadoCivil: 'VIUDA', ipress: 'EUNICE ELIZABETH', fecha: 'Hoy'},
      {nombre: 'FRIDA AIDA PAREDES RUIZ', tipoDoc: 'DNI', numDoc: '23937194', edad: 82, estadoCivil: 'VIUDA', ipress: 'EUNICE ELIZABETH', fecha: 'Hoy'},
      {nombre: 'JUAN ALBERTO DORADO RIVERA', tipoDoc: 'DNI', numDoc: '23825002', edad: 81, estadoCivil: 'CASADO', ipress: 'EUNICE ELIZABETH', fecha: 'Hoy'},
      {nombre: 'MARISABEL CASOS BONETT', tipoDoc: 'DNI', numDoc: '23835688', edad: 75, estadoCivil: 'SOLTERA', ipress: 'EUNICE ELIZABETH', fecha: 'Hoy'},
      {nombre: 'ANA PURIFICACION ZUÑIGA DE GALVEZ', tipoDoc: 'DNI', numDoc: '23835688', edad: 75, estadoCivil: 'SOLTERA', ipress: 'EUNICE ELIZABETH', fecha: 'Ayer'},
      {nombre: 'ANA PURIFICACION ZUÑIGA DE GALVEZ', tipoDoc: 'DNI', numDoc: '23835688', edad: 77, estadoCivil: 'SOLTERA', ipress: 'EUNICE ELIZABETH', fecha: 'Hace 3 dias'},
      {nombre: 'ANA PURIFICACION ZUÑIGA DE GALVEZ', tipoDoc: 'DNI', numDoc: '23835688', edad: 73, estadoCivil: 'CASADA', ipress: 'EUNICE ELIZABETH', fecha: 'Hace 4 dias'},
      {nombre: 'FRIDA AIDA PAREDES RUIZ', tipoDoc: 'DNI', numDoc: '23811054', edad: 81, estadoCivil: 'VIUDA', ipress: 'EUNICE ELIZABETH', fecha: 'Hace 4 dias'},
      {nombre: 'ANA PURIFICACION ZUÑIGA DE GALVEZ', tipoDoc: 'CE', numDoc: '23855637', edad: 76, estadoCivil: 'CASADA', ipress: 'EUNICE ELIZABETH', fecha: 'Hace 10 días'}
    ];
    this.pageNum = 1;
    this.pageSize = 10;
    this.total = this.dataPrueba.length;

    // this.horarioService.getBandejaHorarios({
    //   texto: this.formBuscar.value.frmSearch,
    //   fecInicio: fecInicio,
    //   fecFin: fecFin,
    //   estado: this.formBuscar.value.frmSearchEstado,
    //   unidOperativaId: this.idUnidadOperativaUser,
    //   pageNum: this.pageNum,
    //   pageSize: this.pageSize
    // }).subscribe((data)=>{
    //   if (data.code == 0) {
    //     console.log(data)
    //     const dataObj = Object(data.data);
    //     // console.log(data)
    //     this.dataSource = dataObj.list;

    //     this.pageNum = dataObj.pageNum;
    //     this.pageSize = dataObj.pageSize;
    //     this.total = dataObj.total;
    //   }
    //   else{
    //   }
    // })
    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  }


// // // //   loadUsers(){
// // // //     return this.authService.getUsuariosFromSSO(1,20)
// // // //     .subscribe((rta:any) =>{
// // // //       this.dataSource = new MatTableDataSource(rta.list);
// // // //       this.dataSource.paginator = this.paginator;
// // // //       this.dataSource.sort = this.sort;
// // // //       console.log(rta.list);
// // // //     })
// // // //   }

// // // //   filtrarFechas(): void {}

// // // //   filtrarTabla(event: any): void {}

// // // //   setLink2(nameLink: string, codigo:string){
// // // //       this.breadcrumService.link2$.next({url:'/afiliados/showS'+codigo, title:nameLink});
// // // //       this.router.navigate(['/afiliados/showS/', codigo]);
// // // //   }

// // // //   getClassRow(i:number) :string {
// // // //     let row =""
// // // //     if ( i%2!=0)
// // // //      row ="rowColor" 
// // // //     return row
// // // //   }

// // // //  applyFilter(event: Event) {
// // // //     const filterValue = (event.target as HTMLInputElement).value;
// // // //     this.dataSource.filter = filterValue.trim().toLowerCase();

// // // //     if (this.dataSource.paginator) {
// // // //       this.dataSource.paginator.firstPage();
// // // //     }
// // // //   }

// // // //   // Se agrega esta funcion para opcion de seleccion TODOS
// // // //   selectAll = false;   //dataSource: MatTableDataSource<any>; 
// // // //   toggleSelectAll() {
// // // //     const data = this.dataSource.data;
// // // //     for (const element of data) {
// // // //       element.isSelected = this.selectAll;
// // // //     }
// // // //   }

  
  getDataFecha(value: any){
    this.formBuscar.get('frmSearchDate')?.setValue(value);
    var init = value.split(' - ')[0];
    var fin = value.split(' - ')[1];
    // Dependiendo del formato requerido en el servicio, ordenar aca ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    this.filtroFecInit = init.split('/')[2]+'-'+init.split('/')[1]+'-'+init.split('/')[0];
    this.filtroFecFin = fin.split('/')[2]+'-'+fin.split('/')[1]+'-'+fin.split('/')[0];
    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    console.log(this.filtroFecInit, this.filtroFecFin)
    this.onLoadData();
  }

  handlePageEvent(event: PageEvent) {
    // console.log(this.pageSizeOptions);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.onLoadData();
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








