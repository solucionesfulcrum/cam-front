import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CamsService } from 'src/app/core/_service/cams.service';
import { RedesService } from 'src/app/core/_service/redes.service';
import { MatSort } from '@angular/material/sort';


const history_programs= [
  {
    cam:'PROGRAMA RED ADULTO MAYOR ', 
    adminCam: 'ROXANA ESTRADA ARIAS',
    fechaCreacion: '31/08/2022', 
    codigo: '3145000', 
    red: 'RED TUMBES', 
    estado: 'DISPONIBLE',
  },{
    cam:'PROGRAMA RED SALUD INTEGRAL ', 
    adminCam: 'JUAN ALBERTO DORADO RIVERA',
    fechaCreacion: '03/03/2022', 
    codigo: '3145420', 
    red: 'RED AYACUCHO', 
    estado: 'DISPONIBLE',
  },
];

@Component({
  selector: 'app-sub-list-cams-red',
  templateUrl: './sub-list-cams-red.component.html',
  styleUrls: ['../show-red.component.css']
})
export class SubListCamsRedComponent implements OnInit {

form= this.fb.group({
  fechaIni: [''],
  fechaFin: [''],
});

displayedColumns: string[] = [
    'index',
    'cam',
    'adminCam',
    'fechaCreacion',
    'codigo',
    'red',
    'estado',
  ];

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  id ='' 
  name ='ACTUALIZAMEEEE' 

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private redesService: RedesService,
    ) {
      this.route.parent?.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      breadcrumService.subLink1$.next({ url: './', title:'CAMS'});
      breadcrumService.subLink2$.next({ url: '', title:'' });
      breadcrumService.subLink3$.next({ url: '', title:'' });
      breadcrumService.subActiveTab$.next('/cams/redes/show/'+this.id+'/cams');
      this.loadCamsByIdRed() 
    });

  }

  ngOnInit(): void {
  }

  loadCamsByIdRed(){
    console.log("iot....", this.id)
    this.redesService.listarPorId(parseInt(this.id)).subscribe((rta:any)=>{
      console.log(rta.cams)
      this.dataSource= rta.cams
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

}