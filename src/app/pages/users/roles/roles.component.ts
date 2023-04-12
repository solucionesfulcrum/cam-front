import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  form= this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });

  @ViewChild('paginator') paginator: MatPaginator;
  dataSource= new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'descripcionC',
    'celular',
    'fechaInscripcion',
    'codigo',
    'red',
    'estado',
  ];

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private ciramService: CiramsService
    ) {
      breadcrumService.link1$.next({ url: '/usuarios/roles', title:'ROLES DE USUARIOS' });
      breadcrumService.activeTab$.next('roles');
      this.breadcrumService.link2$.next({url:'' ,title:''});
      this.breadcrumService.link3$.next({url:'', title:''});
      this.loadRoles()

  }

  ngOnInit(): void {
  }

  filtrarTabla(event: any): void {}

  loadRoles(){
    const tmp = this.ciramService.listar()
    .subscribe((rta:any) =>{
      this.dataSource = rta
    })
  }

  setLink2(nameLink: string, codigo:string){
      this.breadcrumService.link2$.next({url:'/usuarios/show/'+codigo, title:nameLink});
      this.router.navigate(['/usuarios/roles/show/', codigo]);
  }

}