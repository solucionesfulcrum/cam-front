import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { AfiliacionesEvaluacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-evaluaciones.service';

@Component({
  selector: 'esp-evaluacion-b-katz',
  templateUrl: './evaluacion-b-katz.component.html',
  styleUrls: ['./evaluacion-b-katz.component.scss']
})
export class EvaluacionBKatzComponent {

  faArrowAltCircleRight = faArrowAltCircleRight;
  preguntas: any[] = [
    {descripcion: '¿Puede Bañarse sin ayuda de otra persona?', respuesta: 0},
    {descripcion: '¿Puede Vestirse sin ayuda de otra persona?', respuesta: 0},
    {descripcion: '¿Puede hacer uso de servicios Higiénicos sin ayuda de otra persona?', respuesta: 0},
    {descripcion: '¿Puedes levantarte de una silla o de la cama sin asistencia?', respuesta: 0},
    {descripcion: '¿Alguna vez has experimentado la pérdida involuntaria de orina o heces?', respuesta: 0},
    {descripcion: '¿Alguna vez has tenido fugas de orina al toser, estornudar, reír, hacer ejercicio o levantar algo pesado?', respuesta: 0},
  ];
  
  constructor(public evaluacionService           : AfiliacionesEvaluacionesService) { }

  ngOnInit(){
  }

  selectAll(opt: string){
    for (let i = 0; i < this.preguntas.length; i++) {
      (this.evaluacionService.formDataTestKatz.get('pregKatz_'+i) as FormControl).setValue(opt);
    }
  }

}
