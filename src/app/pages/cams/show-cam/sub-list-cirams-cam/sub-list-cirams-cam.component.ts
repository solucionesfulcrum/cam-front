import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

const CAMS= [
  {
    cam:'PROGRAMA ADULTO MAYOR ', 
    adminCam: 'ROXANA ESTRADA ARIAS',
    fechaCreacion: '31/08/2022', 
    codigo: '3145000', 
    red: 'RED TUMBES', 
    estado: 'DISPONIBLE',
  },{
    cam:'PROGRAMA SALUD INTEGRAL ', 
    adminCam: 'JUAN ALBERTO DORADO RIVERA',
    fechaCreacion: '03/03/2022', 
    codigo: '3145420', 
    red: 'RED AYACUCHO', 
    estado: 'DISPONIBLE',
  },
];

@Component({
  selector: 'app-sub-list-cirams-cam',
  templateUrl: './sub-list-cirams-cam.component.html',
  styleUrls: ['../show-cam.component.css']
})
export class SubListCiramsCamComponent implements OnInit {

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
  dataSource= new MatTableDataSource<any>(CAMS);

  id ='' 
  name ='CAM TALARA' 

 constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService
    ) {
      this.route.parent?.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      breadcrumService.subLink1$.next({ url: './cirams', title:'CIRAMS'});
      breadcrumService.subLink2$.next({ url: '', title:'' });
      breadcrumService.subLink3$.next({ url: '', title:'' });
      breadcrumService.subActiveTab$.next('/cams/show/'+this.id+'/cirams');

    });

  }

  ngOnInit(): void {
  }

}
