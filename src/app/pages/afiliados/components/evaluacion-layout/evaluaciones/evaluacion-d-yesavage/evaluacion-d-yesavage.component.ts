import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
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
              public notificationService         : NotificationService) { }

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


}
