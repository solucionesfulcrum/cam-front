import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { RegisterAnswersUnit, RequestRegisterAnswersEvaluacion } from '@models/afiliaciones/evaluaciones/evaluacion-evaluar.model';
import { RequestStatus } from '@models/request-status.model';
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
  validated = false;
  status: RequestStatus = 'init';
  
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
    this.validated = true;
    if (this.evaluacionService.formDataTestKatz.valid) {
      this.status = 'loading';
      this.evaluacionService.registerEvaluacionRespuesta(this.getAnswers()).subscribe((data)=>{
        if (data.code == 0) {
          this.router.navigate(['app/afiliados/evaluacion/agregaEval/eva-gijon']);
          this.status = 'success';
        }
        else{
          this.notificationService.warning(data.message);
          this.status = 'failed';
        }
      })
    }
    else{
      this.evaluacionService.formDataTestKatz.markAllAsTouched();
    }
  }

  getAnswers(): RequestRegisterAnswersEvaluacion{
    return {
      cabecera: {
        tipoEvaluacion: JSON.parse(localStorage.getItem('datosEvaluacion')!).tipoEvaluacion,
        idOrigen: JSON.parse(localStorage.getItem('datosEvaluacion')!).idOrigen,
        idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
        pagina: 2,
        idUsuarioReg: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario
      },
      detalle: this.getUnitAnswers()
    }
  }

  getUnitAnswers(): RegisterAnswersUnit[]{
    let listAnsw: RegisterAnswersUnit[] = [];
    Object.keys(this.evaluacionService.formDataTestKatz.controls).forEach((x: any, index)=>{
      let respuesta: RegisterAnswersUnit = {
        tipoCuestionario: 'INDIVIDUAL',
        idCuestionario: this.preguntas[index].idCuestionario,
        respuesta1: (this.evaluacionService.formDataTestKatz.get(x).value === 'SI' ? 1 : 0),
        respuesta2: (this.evaluacionService.formDataTestKatz.get(x).value === 'NO' ? 1 : 0)
      };
      listAnsw.push(respuesta);
      // //console.log(this.evaluacionService.formDataTestKatz.get(x).value, index)
      // //console.log(this.preguntas[index])
    })
    
    return listAnsw;
  }

}
