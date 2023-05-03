import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Ciram } from 'src/app/core/_model/ciram.model';
import { Usuario } from 'src/app/core/_model/usuario';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-sub-list-usuarios-ciram',
  templateUrl: './sub-list-usuarios-ciram.component.html',
  styleUrls: ['../show-ciram.component.css']
})
export class SubListUsuariosCiramComponent implements OnInit {

form= this.fb.group({
  fechaIni: [''],
  fechaFin: [''],
});

displayedColumns: string[] = [
    'cam',
    'adminCam',
    'fechaCreacion',
    'codigo',
    'red',
    'estado',
  ];

  @ViewChild('paginatorProfesional') paginatorProfesional: MatPaginator;
  dataSource= new MatTableDataSource<any>();

  id ='' 
  name ='ACTUALIZAMEEEE' 

  usuarios: Usuario[]=[]

 constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService, 
    private ciramsService: CiramsService,
    ) {
      this.route.parent?.paramMap.subscribe(params => {
      this.id = params.get('id')!;

      breadcrumService.subLink1$.next({ url: './usuarios', title:'USUARIOS'});
      breadcrumService.subLink2$.next({ url: '', title:'' });
      breadcrumService.subLink3$.next({ url: '', title:'' });
      breadcrumService.subActiveTab$.next('/cams/cirams/show/'+this.id);
    });
  }

  ngOnInit(): void {
  }

  loadUsuariosByRed(){
    this.ciramsService.getUsuariosByCiram(this.id)
    .subscribe((rta:any) =>{
      console.log("its loading get usuarios by cvam.... ", rta )
      this.usuarios = rta
      this.dataSource = rta
    })
  }

}