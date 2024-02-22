import { Component } from '@angular/core';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'esp-evaluacion-c-gijon',
  templateUrl: './evaluacion-c-gijon.component.html',
  styleUrls: ['./evaluacion-c-gijon.component.scss']
})
export class EvaluacionCGijonComponent {

  faArrowAltCircleRight = faArrowAltCircleRight;

  pregSitFam: any[] = [
    {descripcion: 'Vive con pareja y/o familia sin conflicto.', respuesta: 0},
    {descripcion: 'Vive con pareja de similar edad', respuesta: 0},
  ];

  pregRelCon: any[] = [
    {descripcion: 'Mantiene relaciones sociales fuera del domicilio', respuesta: 0},
    {descripcion: 'Sólo se relaciona con familia/vecinos/otros, sale de casa', respuesta: 0},
    {descripcion: 'Sólo se relaciona con familia, sale de casa', respuesta: 0},
    {descripcion: 'No sale de su domicilio, recibe familia o visitas (< 1 por semana)', respuesta: 0},
    {descripcion: 'No sale del domicilio, ni recibe visitas (> 1 por semana)', respuesta: 0}
  ];

  pregApoRed: any[] = [
    {descripcion: 'No necesita ningún apoyo', respuesta: 0},
    {descripcion: 'Recibe apoyo de la familia y/o vecinos', respuesta: 0},
    {descripcion: 'Recibe apoyo social formal suficiente (centro de día, trabajador/a familiar, vive en residencia, etc.)', respuesta: 0},
    {descripcion: 'Tiene soporte social, pero es insuficiente', respuesta: 0},
    {descripcion: 'No tiene ningún soporte social y lo necesita', respuesta: 0}
  ];

  respuestas: any[] = [];

  constructor() { }

  ngOnInit(){
    // this.respuestas[4] = {respuesta: 'owo'};
    // console.log(this.respuestas)
  }

}
