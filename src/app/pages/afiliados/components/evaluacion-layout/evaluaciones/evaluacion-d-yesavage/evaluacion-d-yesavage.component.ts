import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { AfiliacionesEvaluacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-evaluaciones.service';

@Component({
  selector: 'esp-evaluacion-d-yesavage',
  templateUrl: './evaluacion-d-yesavage.component.html',
  styleUrls: ['./evaluacion-d-yesavage.component.scss']
})
export class EvaluacionDYesavageComponent {

  faArrowAltCircleRight = faArrowAltCircleRight;
  preguntas: any[] = [
    {descripcion: '¿Está básicamente satisfecho con su vida?', respuesta: 0},
    {descripcion: '¿Ha dejado abandonadas muchas actividades y pasatiempos?', respuesta: 0},
    {descripcion: '¿Siente Ud. que su vida está vacía?', respuesta: 0},
    {descripcion: '¿Se siente a menudo aburrido?', respuesta: 0},
    {descripcion: '¿Está de buen ánimo (talante) la mayor parte del tiempo?', respuesta: 0},
    {descripcion: '¿Tiene miedo de que le suceda algo malo?', respuesta: 0},
    {descripcion: '¿Se siente feliz la mayor parte del tiempo?', respuesta: 0},
    {descripcion: '¿Se siente a menudo sin esperanza?', respuesta: 0},
    {descripcion: '¿Prefiere quedarse en casa más que salir a hacer cosas nuevas?', respuesta: 0},
    {descripcion: '¿Piensa que tiene más problemas con su memoria que la mayoría de personas de su edad?', respuesta: 0},
    {descripcion: '¿Cree que es maravilloso estar vivo?', respuesta: 0},
    {descripcion: '¿Piensa que “no vale para nada” tal como está ahora?', respuesta: 0},
    {descripcion: '¿Piensa que su situación actual es desesperada?', respuesta: 0},
    {descripcion: '¿Se siente lleno de energía?', respuesta: 0},
    {descripcion: '¿Cree que la mayoría de la gente está mejor que usted?', respuesta: 0},
  ];

  constructor(public evaluacionService           : AfiliacionesEvaluacionesService) { }

  ngOnInit(){
  }

  selectAll(opt: string){
    for (let i = 0; i < this.preguntas.length; i++) {
      (this.evaluacionService.formDataTestYesa.get('pregYesa_'+i) as FormControl).setValue(opt);
    }
  }


}
