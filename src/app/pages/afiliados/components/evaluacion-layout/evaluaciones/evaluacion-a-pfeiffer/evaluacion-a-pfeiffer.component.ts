import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@services/notification.service';
import { AfiliacionesEvaluacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-evaluaciones.service';

@Component({
  selector: 'esp-evaluacion-a-pfeiffer',
  templateUrl: './evaluacion-a-pfeiffer.component.html',
  styleUrls: ['./evaluacion-a-pfeiffer.component.scss']
})
export class EvaluacionAPfeifferComponent {

  faArrowAltCircleRight = faArrowAltCircleRight;
  dataTestA: any = Object();
  preguntas: any[] = [];

  constructor(public evaluacionService           : AfiliacionesEvaluacionesService,
              public notificationService         : NotificationService) { }

  ngOnInit(){
    this.evaluacionService.getEvaluacionPreguntas().subscribe((data)=>{
      if (data.code == 0) {
        this.dataTestA = data.data.individuales.find((x: any)=> {return x.idCuestCategoria == 1});
        this.preguntas = this.dataTestA.cuestionarios;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  selectAll(opt: string){
    for (let i = 0; i < this.preguntas.length; i++) {
      (this.evaluacionService.formDataTestPfi.get('pregPfi_'+i) as FormControl).setValue(opt);
    }
  }

}
