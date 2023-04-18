import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CamsService } from 'src/app/core/_service/cams.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { AuthService } from '../../auth/services/auth-service.service';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

form= this.fb.group({
  fechaIni: [''],
  fechaFin: [''],
});

displayedColumns: string[] = [
    'nombres',
    'usuario',
    'cam',
    'rol',
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
      breadcrumService.link1$.next({ url: '/usuarios', title:'USUARIOS' });
      this.breadcrumService.link2$.next({url:'' ,title:''});
      this.breadcrumService.link3$.next({url:'', title:''});
      breadcrumService.activeTab$.next('/usuarios');
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
      this.breadcrumService.link2$.next({url:'/usuarios/show/'+codigo, title:nameLink});
      this.router.navigate(['/usuarios/show/', codigo]);
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

}