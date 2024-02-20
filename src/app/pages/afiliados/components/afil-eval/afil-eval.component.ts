import { Component, OnInit, ViewChild, NgModule, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


const dsEval= [
  {
    i:'1', 
    fechaEvaluac: '02/08/2023',
    horaEvaluac: '11:39 am', 
    descripEvaluac: 'Fin evaluacion Test de Katz', 

  },{
    i:'2', 
    fechaEvaluac: '01/07/2023',
    horaEvaluac: '08:39 am', 
    descripEvaluac: 'Inicio evaluación Test Pfeiffer', 
  },{
    i:'3', 
    fechaEvaluac: '01/07/2023',
    horaEvaluac: '10:39 am', 
    descripEvaluac: 'Fin evaluación Test Pfeiffer', 
  },{
    i:'4', 
    fechaEvaluac: '01/08/2023',
    horaEvaluac: '11:39 am', 
    descripEvaluac: 'Inicio evaluacion Test de Katz', 

  },
];

@Component({
  selector: 'app-afil-eval',
  templateUrl: './afil-eval.component.html',
  styleUrls: ['./afil-eval.component.css']
})
export class AfilEvalComponent implements OnInit {
  datosFormato: any = [];

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
  
    @ViewChild('paginatorProfesional') paginatorProfesional!: MatPaginator;
    
    dataSourceEv = new MatTableDataSource<any>(dsEval);
          
 constructor(
    private fb: FormBuilder, 
    ) {
  }

  formatDateEv(dateString: string | null): string {
    if (dateString !== null) {
      const dateParts = dateString.split('/');
      const year = parseInt(dateParts[2], 10);
      const month = parseInt(dateParts[1], 10);
      const day = parseInt(dateParts[0], 10);
      const date = new Date(year, month - 1, day); // El mes debe estar en base 0
  
      if (!isNaN(date.getTime())) {
        const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const dayOfWeek = daysOfWeek[date.getDay()];
        const dayOfMonth = date.getDate();
        const monthName = months[date.getMonth()];
        const yearNumber = date.getFullYear();
  
        return `${dayOfWeek}, ${dayOfMonth} de ${monthName} de ${yearNumber}`;
      } else {
        return ''; // La fecha no es válida, manejo de error
      }
    } else {
      return ''; // Manejo de caso en el que dateString es nulo
    }
  }

  ngOnInit(): void {

    let fechaActual = '';

    dsEval.sort((one, two) => (new Date(parseInt(one.fechaEvaluac.split('/')[2]),parseInt(one.fechaEvaluac.split('/')[1]), parseInt(one.fechaEvaluac.split('/')[0])) > new Date(parseInt(two.fechaEvaluac.split('/')[2]),parseInt(two.fechaEvaluac.split('/')[1]), parseInt(two.fechaEvaluac.split('/')[0])) ? -1 : 1))

    dsEval.forEach((x)=>{
      console.log(new Date(x.fechaEvaluac))
      if(fechaActual != x.fechaEvaluac){
        fechaActual = x.fechaEvaluac;
        this.datosFormato.push({date:x.fechaEvaluac, actividades: []})
      }
      
      if(x.fechaEvaluac == fechaActual){
        this.datosFormato.find((z:any)=>{ return z.date === x.fechaEvaluac}).actividades.push({
          hora: x.horaEvaluac, tarea:x.descripEvaluac
        })
      }
    })
    console.log(this.datosFormato)

  }


}
