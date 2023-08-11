import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { AuthService } from '../../auth/services/auth-service.service';
import { Parametro } from 'src/app/shared/components/opciones-busqueda/parametros-busqueda.model';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  opciones: Parametro[] = [
    {nombre:'Disponibles', valor1:'01'},
    {nombre:'Suspendido', valor1:'02'},
    {nombre:'No Disponible', valor1:'03'}
  ]

  form= this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });

  @ViewChild('paginator') paginator: MatPaginator;
  dataSource2= new MatTableDataSource<any>();
  counter: number = 1; // Initialize the counter to 1

  displayedColumns: string[] = [
    'counter', // Add the new column for the counter field
    'nombre',
    'descripcion',
    'permisos',
    'fechReg',
    'estado',
  ];

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private authService: AuthService 
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
    return this.authService.getRolesFromSSO(1,20)
    .subscribe((rta:any) =>{
      const respuesta = JSON.parse(rta as string);
      console.log("role...", respuesta.list )
      //this.dataSource2 = respuesta.list
      // Update the dataSource2 with roles and set the counter for each role
      this.dataSource2.data = respuesta.list.map((role: any) => {
      role.counter = this.counter++;
      return role;
});
    })
  }

  goToNewRol(){
    this.router.navigate(['/usuarios/roles/new']);
  }

  setLink2(nameLink: string, codigo:string){
      this.breadcrumService.link2$.next({url:'/usuarios/show/'+codigo, title:nameLink});
      this.router.navigate(['/usuarios/roles/show/', codigo]);
  }

  getClassRow(i:number) :string {
    let row =""
    if ( i%2!=0)
     row ="rowColor" 
    return row
  }

}