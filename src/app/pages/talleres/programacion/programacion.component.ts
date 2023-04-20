import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { AuthService } from '../../auth/services/auth-service.service';

@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.component.html',
  styleUrls: ['./programacion.component.css']
})
export class ProgramacionComponent implements OnInit {

  form= this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });

  @ViewChild('paginator') paginator: MatPaginator;
  dataSource2= new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'idRolAplicacion',
    'codigo',
    'nombre',
  ];

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private authService: AuthService 
    ) {
      breadcrumService.link1$.next({ url: '/talleres/programacion', title:'PROGRAMACIÓN' });
      breadcrumService.activeTab$.next('programacion');
      this.breadcrumService.link2$.next({url:'' ,title:''});
      this.breadcrumService.link3$.next({url:'', title:''});
      this.loadRoles()
  }

  ngOnInit(): void {
  }

  filtrarTabla(event: any): void {}

  loadRoles(){
    return this.authService.getRolesFromSSO(1,20)
    .subscribe((rta:any) =>{
      const respuesta = JSON.parse(rta as string);
      console.log("role...", respuesta.list )
      this.dataSource2 = respuesta.list
    })
  }

  setLink2(nameLink: string, codigo:string){
      this.breadcrumService.link2$.next({url:'/talleres/show/'+codigo, title:nameLink});
      this.router.navigate(['/talleres/programacion/show/', codigo]);
  }

  getClassRow(i:number) :string {
    let row =""
    if ( i%2!=0)
     row ="rowColor" 
    return row
  }

}