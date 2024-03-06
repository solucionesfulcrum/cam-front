import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { RegisterAnswersUnit, RequestEvaluacionRespuestas, RequestRegisterAnswersEvaluacion } from '@models/afiliaciones/evaluaciones/evaluacion-evaluar.model';
import { RequestStatus } from '@models/request-status.model';
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
  validated = false;
  status: RequestStatus = 'init';

  constructor(public evaluacionService           : AfiliacionesEvaluacionesService,
              public notificationService         : NotificationService,
              public router                      : Router) { }

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

  validateFormNextPage(){
    this.validated = true;

    if (this.evaluacionService.formDataTestPfi.valid) {
      this.status = 'loading';
      this.evaluacionService.registerEvaluacionRespuesta(this.getAnswers()).subscribe((data)=>{
        if (data.code == 0) {
          this.router.navigate(['app/afiliados/evaluacion/agregaEval/eva-katz']);
          this.status = 'success';
        }
        else{
          this.notificationService.warning(data.message);
          this.status = 'failed';
        }
      })
    }
    else{
      this.evaluacionService.formDataTestPfi.markAllAsTouched();
    }
  }

  getAnswers(): RequestRegisterAnswersEvaluacion{
    return {
      cabecera: {
        idFichaAdmision: JSON.parse(localStorage.getItem('idFichaEvaluada')!),
        idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
        pagina: 1
      },
      detalle: this.getUnitAnswers()
    }
  }

  getUnitAnswers(): RegisterAnswersUnit[]{
    let listAnsw: RegisterAnswersUnit[] = [];
    Object.keys(this.evaluacionService.formDataTestPfi.controls).forEach((x: any, index)=>{
      let respuesta: RegisterAnswersUnit = {
        tipoCuestionario: 'INDIVIDUAL',
        idCuestionario: this.preguntas[index].idCuestionario,
        respuesta1: (this.evaluacionService.formDataTestPfi.get(x).value === 'BIEN' ? 1 : 0),
        respuesta2: (this.evaluacionService.formDataTestPfi.get(x).value === 'MAL' ? 1 : 0)
      };
      listAnsw.push(respuesta);
      // console.log(this.evaluacionService.formDataTestPfi.get(x).value, index)
      // console.log(this.preguntas[index])
    })
    
    return listAnsw;
  }
}
