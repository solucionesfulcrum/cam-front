import { DataSource } from '@angular/cdk/collections';
import { VariableBinding } from '@angular/compiler';
import { Component, OnInit, ViewChild, NgModule, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';


const dsOper= [
  {
    i:'1', 
    fechaOperac: '18/07/2023',
    horaOperac: '11:39 am', 
    descripOperac: 'Marco Asistencia en el taller de Yoga', 
  },{
    i:'2', 
    fechaOperac: '12/07/2023',
    horaOperac: '08:39 am', 
    descripOperac: 'Solicitó unirse al proyecto CAM', 
  },{
    i:'3', 
    fechaOperac: '26/05/2023',
    horaOperac: '08:39 am', 
    descripOperac: 'Solicitó unirse al proyecto CAM', 
  },{
    i:'4', 
    fechaOperac: '26/05/2023',
    horaOperac: '11:39 am', 
    descripOperac: 'Finalizo la Evaluación siendo aceptado en el proyecto CAM', 
  },{
    i:'4', 
    fechaOperac: '26/05/2023',
    horaOperac: '11:39 am', 
    descripOperac: 'Se le asigno al CAM lima Centro', 
  },
  
];


const dsEval= [
  {
    i:'1', 
    fechaOperac: 'Miercoles , 08 de Julio del 2023',
    horaOperac: '11:39 am', 
    descripOperac: 'Fin evaluacion test pfiffer', 

  },{
    i:'2', 
    fechaOperac: 'Miercoles , 01 de Julio del 2023',
    horaOperac: '08:39 am', 
    descripOperac: 'Inicio evaluación test pfiffer', 
  },
];



@Component({
  selector: 'app-afil-oper',
  templateUrl: './afil-oper.component.html',
  styleUrls: ['./afil-oper.component.css']
})


export class AfilOperComponent implements OnInit {
   
    form= this.fb.group({
      fechaIni: [''],
      fechaFin: [''],
    });
    
    displayedColumns: string[] = [
        //'i',
        'fechaOperac',
        'horaOperac',
        'descripOperac',
        
      ];
    
      @ViewChild('paginatorProfesional') paginatorProfesional: MatPaginator;
    
      
      dataSourceOp = new MatTableDataSource<any>(dsOper);
      
      dataSourceEv = new MatTableDataSource<any>(dsEval);
      
      id ='' 
      name ='CAM TALARA' 
   

   constructor(
      private fb: FormBuilder, 
      ) {
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
