import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Programa } from 'src/app/core/_model/programa.model';

@Component({
  selector: 'app-sub-list-programas-cam',
  templateUrl: './sub-list-programas-cam.component.html',
  styleUrls: ['../show-cam.component.css']
})
export class SubListProgramasCamComponent implements OnInit {

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
  programas : Programa[]= []

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService
    ) {
      this.route.parent?.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      breadcrumService.subLink1$.next({ url: './', title:'PROGRAMAS'});
      breadcrumService.subLink2$.next({ url: '', title:'' });
      breadcrumService.subLink3$.next({ url: '', title:'' });
      breadcrumService.subActiveTab$.next('/cams/show/'+this.id+'/programas');

      
    });

  }

  ngOnInit(): void {
  }

}
