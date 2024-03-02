import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AfiliacionesEvaluacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-evaluaciones.service';

@Component({
  selector: 'esp-contenedor-evaluacion',
  templateUrl: './contenedor-evaluacion.component.html',
  styleUrls: ['./contenedor-evaluacion.component.scss']
})
export class ContenedorEvaluacionComponent {
  
  constructor(public evaluacionService              : AfiliacionesEvaluacionesService,
              private router                        : Router, ){}

  ngOnInit(){
    if (JSON.parse(localStorage.getItem('idFichaEvaluada')!) == null){
      this.router.navigate(['app/afiliados/evaluacion']);
    }
    console.log(JSON.parse(localStorage.getItem('idFichaEvaluada')!))
  }

  ngOnDestroy(){
    localStorage.removeItem('idFichaEvaluada');
    this.evaluacionService.formDataTestPfi.reset();
    this.evaluacionService.formDataTestKatz.reset();
    this.evaluacionService.formDataTestGij.reset();
    this.evaluacionService.formDataTestYesa.reset();
  }
}
