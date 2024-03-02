import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@services/notification.service';
import { AfiliacionesEvaluacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-evaluaciones.service';

@Component({
  selector: 'esp-evaluacion-b-katz',
  templateUrl: './evaluacion-b-katz.component.html',
  styleUrls: ['./evaluacion-b-katz.component.scss']
})
export class EvaluacionBKatzComponent {

  faArrowAltCircleRight = faArrowAltCircleRight;
  dataTestB: any = Object();
  preguntas: any[] = [];
  
  constructor(public evaluacionService           : AfiliacionesEvaluacionesService,
              public notificationService         : NotificationService,
              public router                      : Router) { }

  ngOnInit(){
    
    this.evaluacionService.getEvaluacionPreguntas().subscribe((data)=>{
      if (data.code == 0) {
        this.dataTestB = data.data.individuales.find((x: any)=> {return x.idCuestCategoria == 2});
        this.preguntas = this.dataTestB.cuestionarios;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  selectAll(opt: string){
    for (let i = 0; i < this.preguntas.length; i++) {
      (this.evaluacionService.formDataTestKatz.get('pregKatz_'+i) as FormControl).setValue(opt);
    }
  }

  validateFormNextPage(){
    if (this.evaluacionService.formDataTestKatz.valid) {
      this.router.navigate(['app/afiliados/evaluacion/agregaEval/eva-gijon']);
    }
    else{
      this.evaluacionService.formDataTestKatz.markAllAsTouched();
    }
  }

}
