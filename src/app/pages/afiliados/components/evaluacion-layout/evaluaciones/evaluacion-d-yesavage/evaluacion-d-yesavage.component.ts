import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@services/notification.service';
import { AfiliacionesEvaluacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-evaluaciones.service';

@Component({
  selector: 'esp-evaluacion-d-yesavage',
  templateUrl: './evaluacion-d-yesavage.component.html',
  styleUrls: ['./evaluacion-d-yesavage.component.scss']
})
export class EvaluacionDYesavageComponent {

  faArrowAltCircleRight = faArrowAltCircleRight;
  dataTestD: any = Object();
  preguntas: any[] = [];

  constructor(public evaluacionService           : AfiliacionesEvaluacionesService,
              public notificationService         : NotificationService,
              public router                      : Router) { }

  ngOnInit(){
    this.evaluacionService.getEvaluacionPreguntas().subscribe((data)=>{
      if (data.code == 0) {
        this.dataTestD = data.data.individuales.find((x: any)=> {return x.idCuestCategoria == 4});
        this.preguntas = this.dataTestD.cuestionarios;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  selectAll(opt: string){
    for (let i = 0; i < this.preguntas.length; i++) {
      (this.evaluacionService.formDataTestYesa.get('pregYesa_'+i) as FormControl).setValue(opt);
    }
  }

  validateFormNextPage(){
    if (this.evaluacionService.formDataTestPfi.valid && this.evaluacionService.formDataTestKatz.valid && this.evaluacionService.formDataTestGij.valid && this.evaluacionService.formDataTestYesa.valid) {
      this.router.navigate(['app/afiliados/evaluacion/agregaEval/resultados']);
    }
    else{
      this.evaluacionService.formDataTestPfi.markAllAsTouched();
      this.evaluacionService.formDataTestKatz.markAllAsTouched();
      this.evaluacionService.formDataTestGij.markAllAsTouched();
      this.evaluacionService.formDataTestYesa.markAllAsTouched();
    }
  }

}
