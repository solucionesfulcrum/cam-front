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

  displayedColumns: string[] = [
    'selecc',
    'usuario',
    'tipodoc',
    'nombres',
    'edad',
    'estcivil',
    'ipress',
    'tieneVigencia',
  ];

  breadcrum1:{url:string, title:string }   
  breadcrum2:{url:string, title:string } 
  breadcrum3:{url:string, title:string } 

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
    breadcrumService.link1$.next({ url: '/afiliados/solicitudes', title:'SOLICITUDES' });
    this.breadcrumService.link2$.next({url:'' ,title:''});
    this.breadcrumService.link3$.next({url:'', title:''});
    breadcrumService.activeTab$.next('/afiliados/solicitudes');
    this.loadUsers()
   }

  ngOnInit(): void {
  }

  loadUsers(){
    return this.authService.getUsuariosFromSSO(1,20)
    .subscribe((rta:any) =>{
      this.dataSource = new MatTableDataSource(rta.list);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  filtrarFechas(): void {}

  filtrarTabla(event: any): void {}

  setLink2(nameLink: string, codigo:string){
      this.breadcrumService.link2$.next({url:'/afiliados/showS'+codigo, title:nameLink});
      this.router.navigate(['/afiliados/showS/', codigo]);
  }

  getClassRow(i:number) :string {
    let row =""
    if ( i%2!=0)
     row ="rowColor" 
    return row
  }

 applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Se agrega esta funcion para opcion de seleccion TODOS
  selectAll = false;   //dataSource: MatTableDataSource<any>; 
  toggleSelectAll() {
    const data = this.dataSource.data;
    for (const element of data) {
      element.isSelected = this.selectAll;
    }
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








