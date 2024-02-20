import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';


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
  selector: 'app-sub-list-activaciones-afil',
  templateUrl: './sub-list-activaciones-afil.component.html',
  styleUrls: ['./sub-list-activaciones-afil.component.css']
})
export class SubListActivacionesAfilComponent implements OnInit {

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
  
    @ViewChild('paginatorProfesional') paginatorProfesional!: MatPaginator;
    dataSource= new MatTableDataSource<any>(CAMS);
  
    id ='' 
    name ='CAM TALARA' 
  
   constructor(
      private fb: FormBuilder, 
      private router: Router, 
      private route: ActivatedRoute,
      ) {
        this.route.parent?.paramMap.subscribe(params => {
        this.id = params.get('id')!;  
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

