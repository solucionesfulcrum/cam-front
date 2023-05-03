import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/core/_model/usuario';
import { CamsService } from 'src/app/core/_service/cams.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';



@Component({
  selector: 'app-sub-list-usuarios-cam',
  templateUrl: './sub-list-usuarios-cam.component.html',
  styleUrls: ['../show-cam.component.css']
})
export class SubListUsuariosCamComponent implements OnInit {

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
  name ='CAM TALARA' 

  usuarios : Usuario[] = []

 constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private camService: CamsService,
    ) {
      this.route.parent?.paramMap.subscribe(params => {
      this.id = params.get('id')!;

      breadcrumService.subLink1$.next({ url: './usuarios', title:'USUARIOS'});
      breadcrumService.subLink2$.next({ url: '', title:'' });
      breadcrumService.subLink3$.next({ url: '', title:'' });
      breadcrumService.subActiveTab$.next('/cams/show/'+this.id);
    });
  }

  ngOnInit(): void {
    this.loadCiramsByCam()
  }

  loadCiramsByCam(){
    this.camService.getUsuariosByCam(this.id)
    .subscribe((rta:any) =>{
      console.log("its loading get usuarios by cvam.... ", rta )
      this.usuarios = rta
      this.dataSource = rta
    })
  }

}