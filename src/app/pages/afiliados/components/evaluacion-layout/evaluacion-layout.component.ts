import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@services/notification.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { AfiliacionesEvaluacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-evaluaciones.service';
import { ContactosAfiliadosService } from 'src/app/data/services/contactos/contactos-afiliados.service';
import { DialogNotasComponent } from '../../show-sol/dialog-notas/dialog-notas.component';
import { Dialog } from '@angular/cdk/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluacionAPfeifferComponent } from './evaluaciones/evaluacion-a-pfeiffer/evaluacion-a-pfeiffer.component';
import { RegisterAnswersUnit, RequestRegisterAnswersEvaluacion } from '@models/afiliaciones/evaluaciones/evaluacion-evaluar.model';

@Component({
  selector: 'esp-evaluacion-layout',
  templateUrl: './evaluacion-layout.component.html',
  styleUrls: ['./evaluacion-layout.component.scss']
})
export class EvaluacionLayoutComponent {
  faSpinner = faSpinner;
  dataFicha: any = Object();
  edadPersona: number = 0;

  ready = false;
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Notas', esImagen: true, rutaIcono: 'assets/svg/iconFileEdit.svg'},
    {texto: 'Cancelar', colorBtn:'bordeado'},
    //{texto: 'Guardar Evaluación', colorBtn:'mezclado', loading: false},
  ];

  constructor(public evaluacionService              : AfiliacionesEvaluacionesService,
              public contactosAfiliadosService      : ContactosAfiliadosService,
              private router                        : Router,
              private activeRoute                   : ActivatedRoute,
              private dialog                        : Dialog,
              private compPfeiffer                  : EvaluacionAPfeifferComponent,
              public notificationService            : NotificationService){}

  ngOnInit(){
    if (JSON.parse(localStorage.getItem('idFichaEvaluada')!) != null){
      this.contactosAfiliadosService.obtenerFichaAsegurado(JSON.parse(localStorage.getItem('idFichaEvaluada')!)).subscribe((data)=>{
        if (data.code == 0) {
          this.dataFicha = data.data;
          var dateObject = new Date(data.data.asegurado.fecNacimiento); 
          var timeDiff = Math.abs(Date.now() - dateObject.getTime());
          this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
          this.ready = true;
        }
        else{
          this.notificationService.warning(data.message);
        }
      })
    }
  }

  checkIfAnswered(fg: FormGroup): boolean{
    return Object.values(fg.value).every(value => {if (value == null) { return false } return true;});
  }

  Notas(){
    const dialogRef = this.dialog.open(DialogNotasComponent,{
      minWidth:'800px',
      maxWidth:'50%',        
      data:{
        idSolicitud: this.dataFicha.fichaAdmision.idFichaAdmision,
      }
    })
    dialogRef.closed.subscribe(out =>{
      // //console.log(out)
    })
  }

  evaluarAfiliado(){
    //console.log(this.evaluacionService.formDataTestPfi.valid)
    this.evaluacionService.formDataTestPfi.markAllAsTouched();
    // this.compPfeiffer.validated = true;

    // if (this.evaluacionService.formDataTestPfi.valid) {
    //   //console.log(1)
    //   this.compPfeiffer.status = 'loading';
    //   this.evaluacionService.registerEvaluacionRespuesta(this.getAnswers()).subscribe((data)=>{
    //     if (data.code == 0) {
    //       this.router.navigate(['app/afiliados/evaluacion/agregaEval/eva-katz']);
    //       this.compPfeiffer.status = 'success';
    //     }
    //     else{
    //       this.notificationService.warning(data.message);
    //       this.compPfeiffer.status = 'failed';
    //     }
    //   })
    // }
    // else{
    //   this.evaluacionService.formDataTestPfi.markAllAsTouched();
    // }
    // //console.log(this.router.url)
  }

  getAnswers(): RequestRegisterAnswersEvaluacion{
    return {
      cabecera: {
        tipoEvaluacion: JSON.parse(localStorage.getItem('datosEvaluacion')!).tipoEvaluacion,
        idOrigen: JSON.parse(localStorage.getItem('datosEvaluacion')!).idOrigen,
        idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
        pagina: 1,
        idUsuarioReg: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario
      },
      detalle: this.getUnitAnswers()
    }
  }

  getUnitAnswers(): RegisterAnswersUnit[]{
    let listAnsw: RegisterAnswersUnit[] = [];
    Object.keys(this.evaluacionService.formDataTestPfi.controls).forEach((x: any, index)=>{
      let respuesta: RegisterAnswersUnit = {
        tipoCuestionario: 'INDIVIDUAL',
        idCuestionario: this.compPfeiffer.preguntas[index].idCuestionario,
        respuesta1: (this.evaluacionService.formDataTestPfi.get(x).value === 'BIEN' ? 1 : 0),
        respuesta2: (this.evaluacionService.formDataTestPfi.get(x).value === 'MAL' ? 1 : 0)
      };
      listAnsw.push(respuesta);
      // //console.log(this.evaluacionService.formDataTestPfi.get(x).value, index)
      // //console.log(this.preguntas[index])
    })
    
    return listAnsw;
  }
}
