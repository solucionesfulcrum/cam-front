import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { RegisterAnswersUnit, RequestRegisterAnswersEvaluacion } from '@models/afiliaciones/evaluaciones/evaluacion-evaluar.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { AfiliacionesEvaluacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-evaluaciones.service';

@Component({
  selector: 'esp-evaluacion-c-gijon',
  templateUrl: './evaluacion-c-gijon.component.html',
  styleUrls: ['./evaluacion-c-gijon.component.scss']
})
export class EvaluacionCGijonComponent {

  faArrowAltCircleRight = faArrowAltCircleRight;

  dataTestC: any = Object();
  validated = false;
  status: RequestStatus = 'init';

  // pregSitFam: any[] = [
  //   {descripcion: 'Vive con pareja y/o familia sin conflicto.', respuesta: 0},
  //   {descripcion: 'Vive con pareja de similar edad', respuesta: 0},
  // ];

  // pregRelCon: any[] = [
  //   {descripcion: 'Mantiene relaciones sociales fuera del domicilio', respuesta: 0},
  //   {descripcion: 'Sólo se relaciona con familia/vecinos/otros, sale de casa', respuesta: 0},
  //   {descripcion: 'Sólo se relaciona con familia, sale de casa', respuesta: 0},
  //   {descripcion: 'No sale de su domicilio, recibe familia o visitas (< 1 por semana)', respuesta: 0},
  //   {descripcion: 'No sale del domicilio, ni recibe visitas (> 1 por semana)', respuesta: 0}
  // ];

  // pregApoRed: any[] = [
  //   {descripcion: 'No necesita ningún apoyo', respuesta: 0},
  //   {descripcion: 'Recibe apoyo de la familia y/o vecinos', respuesta: 0},
  //   {descripcion: 'Recibe apoyo social formal suficiente (centro de día, trabajador/a familiar, vive en residencia, etc.)', respuesta: 0},
  //   {descripcion: 'Tiene soporte social, pero es insuficiente', respuesta: 0},
  //   {descripcion: 'No tiene ningún soporte social y lo necesita', respuesta: 0}
  // ];

  respuestas: any[] = [];

  constructor(public evaluacionService           : AfiliacionesEvaluacionesService,
              public notificationService         : NotificationService,
              public router                      : Router) { }

  ngOnInit(){
    this.evaluacionService.getEvaluacionPreguntas().subscribe((data)=>{
      if (data.code == 0) {
        this.dataTestC = data.data.grupales[0];
        this.dataTestC.subCategoria = this.dataTestC.subCategoria.sort((a: any, b: any) => {return a.idCuestSubCategoria - b.idCuestSubCategoria})
        // //console.log(this.dataTestC.subCategoria)
        // this.dataTestA = data.data.individuales.find((x: any)=> {return x.idCuestCategoria == 1});
        // this.preguntas = this.dataTestA.cuestionarios;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  validateFormNextPage(){
    this.validated = true;
    if (this.evaluacionService.formDataTestGij.valid) {
      this.status = 'loading';
      this.evaluacionService.registerEvaluacionRespuesta(this.getAnswers()).subscribe((data)=>{
        // //console.log(this.getAnswers())  
        if (data.code == 0) {
          this.router.navigate(['app/afiliados/evaluacion/agregaEval/eva-yesavage']);
          this.status = 'success';
        }
        else{
          this.notificationService.warning(data.message);
          this.status = 'failed';
        }
      })
    }
    else{
      this.evaluacionService.formDataTestGij.markAllAsTouched();
    }
  }

  getAnswers(): RequestRegisterAnswersEvaluacion{
    return {
      cabecera: {
        tipoEvaluacion: JSON.parse(localStorage.getItem('datosEvaluacion')!).tipoEvaluacion,
        idOrigen: JSON.parse(localStorage.getItem('datosEvaluacion')!).idOrigen,
        idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
        pagina: 3,
        idUsuarioReg: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario
      },
      detalle: this.getUnitAnswers()
    }
  }

  getUnitAnswers(): RegisterAnswersUnit[]{
    let listAnsw: RegisterAnswersUnit[] = [];
    this.dataTestC.subCategoria.find((x: any)=> { return x.idCuestSubCategoria == 1}).cuestionarios.forEach((z: any)=>{
      let respuesta: RegisterAnswersUnit = {
        tipoCuestionario: 'GRUPAL',
        idCuestionario: z.idCuestionario,
        respuesta1: (z.idCuestionario == this.evaluacionService.formDataTestGij.controls.pregFam.value ? 1 : 0),
        respuesta2: 0
      };
      listAnsw.push(respuesta);
    })

    this.dataTestC.subCategoria.find((x: any)=> { return x.idCuestSubCategoria == 2}).cuestionarios.forEach((z: any)=>{
      let respuesta: RegisterAnswersUnit = {
        tipoCuestionario: 'GRUPAL',
        idCuestionario: z.idCuestionario,
        respuesta1: (z.idCuestionario == this.evaluacionService.formDataTestGij.controls.pregRel.value ? 1 : 0),
        respuesta2: 0
      };
      listAnsw.push(respuesta);
    })

    this.dataTestC.subCategoria.find((x: any)=> { return x.idCuestSubCategoria == 3}).cuestionarios.forEach((z: any)=>{
      let respuesta: RegisterAnswersUnit = {
        tipoCuestionario: 'GRUPAL',
        idCuestionario: z.idCuestionario,
        respuesta1: (z.idCuestionario == this.evaluacionService.formDataTestGij.controls.pregApo.value ? 1 : 0),
        respuesta2: 0
      };
      listAnsw.push(respuesta);
    })
    
    return listAnsw;
  }


}
