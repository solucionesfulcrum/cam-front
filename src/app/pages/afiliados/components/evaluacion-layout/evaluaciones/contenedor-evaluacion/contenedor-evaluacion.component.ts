import { Component } from '@angular/core';
import { AfiliacionesEvaluacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-evaluaciones.service';

@Component({
  selector: 'esp-contenedor-evaluacion',
  templateUrl: './contenedor-evaluacion.component.html',
  styleUrls: ['./contenedor-evaluacion.component.scss']
})
export class ContenedorEvaluacionComponent {
  
  constructor(public evaluacionService              : AfiliacionesEvaluacionesService){}

  ngOnInit(){

  }

  ngOnDestroy(){
    this.evaluacionService.formDataTestPfi.reset();
    this.evaluacionService.formDataTestKatz.reset();
    this.evaluacionService.formDataTestGij.reset();
    this.evaluacionService.formDataTestYesa.reset();
  }
}
