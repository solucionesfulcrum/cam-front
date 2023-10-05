import { Component, OnInit, ViewChild, NgModule, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


const dsEval= [
  {
    i:'1', 
    fechaEvaluac: 'Miercoles , 08 de Agosto del 2023',
    horaEvaluac: '11:39 am', 
    descripEvaluac: 'Fin evaluacion Test de Katz', 

  },{
    i:'2', 
    fechaEvaluac: 'Miercoles , 01 de Julio del 2023',
    horaEvaluac: '08:39 am', 
    descripEvaluac: 'Inicio evaluación Test Pfeiffer', 
  },{
    i:'3', 
    fechaEvaluac: 'Miercoles , 08 de Julio del 2023',
    horaEvaluac: '08:39 am', 
    descripEvaluac: 'Inicio evaluación Test Pfeiffer', 
  },{
    i:'1', 
    fechaEvaluac: 'Miercoles , 01 de Agosto del 2023',
    horaEvaluac: '11:39 am', 
    descripEvaluac: 'Fin evaluacion Test de Katz', 

  },
];

@Component({
  selector: 'app-afil-eval',
  templateUrl: './afil-eval.component.html',
  styleUrls: ['./afil-eval.component.css']
})
export class AfilEvalComponent implements OnInit {
  form= this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });
  
  displayedColumns: string[] = [
      //'i',
      'fechaEvaluac',
      'horaEvaluac',
      'descripEvaluac',    
  ];
  
    @ViewChild('paginatorProfesional') paginatorProfesional: MatPaginator;

    dataSourceEv = new MatTableDataSource<any>(dsEval);
    
    id ='' 
    name ='CAM TALARA' 
 
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {  }

  getClassRow(i:number) :string {
    let row =""
    if ( i%2!=0)
     row ="rowColor" 
    return row
  }

}
