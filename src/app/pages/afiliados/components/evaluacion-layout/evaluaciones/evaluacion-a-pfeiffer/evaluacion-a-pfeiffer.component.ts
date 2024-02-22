import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { AfiliacionesEvaluacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-evaluaciones.service';

@Component({
  selector: 'esp-evaluacion-a-pfeiffer',
  templateUrl: './evaluacion-a-pfeiffer.component.html',
  styleUrls: ['./evaluacion-a-pfeiffer.component.scss']
})
export class EvaluacionAPfeifferComponent {

  faArrowAltCircleRight = faArrowAltCircleRight;
  preguntas: any[] = [
    {descripcion: '¿Cuál es la fecha de hoy?', respuesta: 0},
    {descripcion: '¿Qué día de la semana es hoy?', respuesta: 0},
    {descripcion: '¿En qué lugar estamos?', respuesta: 0},
    {descripcion: '¿Cuál es su número de teléfono? O ¿Cuál es su dirección completa?', respuesta: 0},
    {descripcion: '¿Cuántos años tiene?', respuesta: 0},
    {descripcion: '¿Dónde nació?', respuesta: 0},
    {descripcion: '¿Cuál es el nombre del presidente del Perú?', respuesta: 0},
    {descripcion: '¿Cuál es el nombre del presidente anterior?', respuesta: 0},
    {descripcion: '¿Cuál es el nombre de soltera de su madre?', respuesta: 0},
    {descripcion: 'Reste de 3 en tres desde 29.', respuesta: 0},
  ];

  constructor(public evaluacionService           : AfiliacionesEvaluacionesService) { }

  ngOnInit(){
  }

  selectAll(opt: string){
    for (let i = 0; i < this.preguntas.length; i++) {
      (this.evaluacionService.formDataTestPfi.get('pregPfi_'+i) as FormControl).setValue(opt);
    }
  }

}
