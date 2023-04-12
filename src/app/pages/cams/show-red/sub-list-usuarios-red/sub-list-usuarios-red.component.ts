import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

const CIRAMS= [
  {
    cam:'USUARIO REDA ADULTO MAYOR ', 
    adminCam: 'ROXANA ESTRADA ARIAS',
    fechaCreacion: '31/08/2022', 
    codigo: '3145000', 
    red: 'RED TUMBES', 
    estado: 'DISPONIBLE',
  },{
    cam:'USUARIO RED SALUD INTEGRAL ', 
    adminCam: 'JUAN ALBERTO DORADO RIVERA',
    fechaCreacion: '03/03/2022', 
    codigo: '3145420', 
    red: 'RED AYACUCHO', 
    estado: 'DISPONIBLE',
  },
];

@Component({
  selector: 'app-sub-list-usuarios-red',
  templateUrl: './sub-list-usuarios-red.component.html',
  styleUrls: ['../show-red.component.css']
})
export class SubListUsuariosRedComponent implements OnInit {

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
  dataSource= new MatTableDataSource<any>(CIRAMS);

  id ='' 
  name ='ACTUALIZAMEEEE' 

 constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService
    ) {
      this.route.parent?.paramMap.subscribe(params => {
      this.id = params.get('id')!;

      breadcrumService.subLink1$.next({ url: './usuarios', title:'USUARIOS'});
      breadcrumService.subLink2$.next({ url: '', title:'' });
      breadcrumService.subLink3$.next({ url: '', title:'' });
      breadcrumService.subActiveTab$.next('/cams/redes/show/'+this.id);
    });
  }

  ngOnInit(): void {
  }

}