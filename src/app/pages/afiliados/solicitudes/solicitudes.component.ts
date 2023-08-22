import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { AuthService } from '../../auth/services/auth-service.service';
import { Parametro } from 'src/app/shared/components/opciones-busqueda/parametros-busqueda.model';


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
}








