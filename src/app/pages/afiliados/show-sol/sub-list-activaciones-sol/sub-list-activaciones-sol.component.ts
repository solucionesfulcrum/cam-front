import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

const CAMS= [
  {
    i:'1', 
    usuarioResponsable: 'ROXANA ESTRADA ARIAS',
    fechaInicio: '31/08/2022', 
    fechaFin: '31/12/2022', 
    rol: 'Administrador CAM',
    perfil: 'TV', 
  },{
    i:'2', 
    usuarioResponsable: 'SILVA PAIVA MIGUEL ANGEL',
    fechaInicio: '31/08/2022', 
    fechaFin: '31/12/2022', 
    rol: 'Usuario CAM',
    perfil: 'USER', 
  },
]; 

@Component({
  selector: 'app-sub-list-activaciones-sol',
  templateUrl: './sub-list-activaciones-sol.component.html',
  styleUrls: ['./sub-list-activaciones-sol.component.css']
})
export class SubListActivacionesSolComponent implements OnInit {
  form= this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });
  
  displayedColumns: string[] = [
      //'i',
      'usuarioResponsable',
      'fechaInicio',
      'fechaFin',
      'rol',
      'estado',
      'opcion',
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
        breadcrumService.subLink1$.next({ url: './activaciones', title:'ACTIVACIONES'});
        breadcrumService.subLink2$.next({ url: '', title:'' });
        breadcrumService.subLink3$.next({ url: '', title:'' });
        breadcrumService.subActiveTab$.next('/solicitudes/show/'+this.id+'/activaciones');
  
      });
    }
  
    ngOnInit(): void {
    }
  
  getClassRow(i:number) :string {
      let row =""
      if ( i%2!=0)
       row ="rowColor" 
      return row
    }

}
