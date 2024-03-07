import { Component, OnInit, ViewChild, NgModule, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

const dsOper= [
  {
    i:'1', 
    fechaOperac: '18/07/2023',
    horaOperac: '11:39 am', 
    descripOperac: 'Marco Asistencia en el taller de Yoga', 
  },
  
  {
    i:'2', 
    fechaOperac: '12/07/2023',
    horaOperac: '08:39 am', 
    descripOperac: 'Solicitó unirse al proyecto CAM', 
  },
  {
    i:'4', 
    fechaOperac: '26/05/2023',
    horaOperac: '08:39 am', 
    descripOperac: 'Solicitó unirse al proyecto CAM', 
  },
  {
    i:'3', 
    fechaOperac: '26/05/2023',
    horaOperac: '08:39 am', 
    descripOperac: 'Se le asigno al CAM Lima Centro', 
  },
  {
    i:'5', 
    fechaOperac: '26/05/2023',
    horaOperac: '11:39 am', 
    descripOperac: 'Finalizo la Evaluación siendo aceptado en el proyecto CAM', 
  },
  
];

@Component({
  selector: 'app-afil-oper',
  templateUrl: './afil-oper.component.html',
  styleUrls: ['./afil-oper.component.css']
})


export class AfilOperComponent implements OnInit {
   
  datosFormato: any = [];

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
    
      @ViewChild('paginatorProfesional') paginatorProfesional!: MatPaginator;
      
      dataSourceOp = new MatTableDataSource<any>(dsOper);
            
   constructor(
      private fb: FormBuilder, 
      ) {
    }
  
    formatDate(dateString: string | null): string {
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

      dsOper.sort((one, two) => (new Date(parseInt(one.fechaOperac.split('/')[2]),parseInt(one.fechaOperac.split('/')[1]), parseInt(one.fechaOperac.split('/')[0])) > new Date(parseInt(two.fechaOperac.split('/')[2]),parseInt(two.fechaOperac.split('/')[1]), parseInt(two.fechaOperac.split('/')[0])) ? -1 : 1))

      dsOper.forEach((x)=>{
        // console.log(new Date(x.fechaOperac))
        if(fechaActual != x.fechaOperac){
          fechaActual = x.fechaOperac;
          this.datosFormato.push({date:x.fechaOperac, actividades: []})
        }
        
        if(x.fechaOperac == fechaActual){
          this.datosFormato.find((z:any)=>{ return z.date === x.fechaOperac}).actividades.push({
            hora: x.horaOperac, tarea:x.descripOperac
          })
        }
      })
      // console.log(this.datosFormato)

    }
   
}
