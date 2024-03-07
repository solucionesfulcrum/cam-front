import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RequestEvaluacionRespuestas } from '@models/afiliaciones/evaluaciones/evaluacion-evaluar.model';
import { NotificationService } from '@services/notification.service';
import { AfiliacionesEvaluacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-evaluaciones.service';

@Component({
  selector: 'esp-contenedor-evaluacion',
  templateUrl: './contenedor-evaluacion.component.html',
  styleUrls: ['./contenedor-evaluacion.component.scss']
})
export class ContenedorEvaluacionComponent {
  
  constructor(public evaluacionService              : AfiliacionesEvaluacionesService,
              private notificationService           : NotificationService,
              private router                        : Router, ){}

  ngOnInit(){
    if (JSON.parse(localStorage.getItem('idFichaEvaluada')!) == null){
      this.router.navigate(['app/afiliados/evaluacion']);
      this.notificationService.warning('Porfavor ingresar desde una Ficha de Asegurado o Ficha de Solicitud');
    }
    else{
      this.getRespuestas();
    }
  }

  ngOnDestroy(){
    localStorage.removeItem('idFichaEvaluada');
    localStorage.removeItem('datosEvaluacion');
    this.evaluacionService.formDataTestPfi.reset();
    this.evaluacionService.formDataTestKatz.reset();
    this.evaluacionService.formDataTestGij.reset();
    this.evaluacionService.formDataTestYesa.reset();
  }

  getRespuestas(){
    //  Test Pfeiffer
    this.evaluacionService.getRespuestasEvaluacion(this.getModel(1)).subscribe((data)=>{
      if (data.code == 0) {
        if (data.data.individuales.length > 0) {
          if (data.data.individuales[0].cuestionarios.length > 0) {
            Object.keys(this.evaluacionService.formDataTestPfi.controls).forEach((x: any, index)=>{
              let valor = (data.data.individuales[0].cuestionarios[index].respuesta1 == 1 ? 'BIEN' : data.data.individuales[0].cuestionarios[index].respuesta2 == 1 ? 'MAL' : null);
              this.evaluacionService.formDataTestPfi.get(x).setValue(valor);
            })
          }
        }
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
    //  Test KATZ
    this.evaluacionService.getRespuestasEvaluacion(this.getModel(2)).subscribe((data)=>{
      if (data.code == 0) {
        if (data.data.individuales.length > 0) {
          if (data.data.individuales[0].cuestionarios.length > 0) {
            Object.keys(this.evaluacionService.formDataTestKatz.controls).forEach((x: any, index)=>{
              let valor = (data.data.individuales[0].cuestionarios[index].respuesta1 == 1 ? 'SI' : data.data.individuales[0].cuestionarios[index].respuesta2 == 1 ? 'NO' : null);
              this.evaluacionService.formDataTestKatz.get(x).setValue(valor);
            })
          }
        }
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
    //  Test GIJÓN
    this.evaluacionService.getRespuestasEvaluacion(this.getModel(3)).subscribe((data)=>{
      if (data.code == 0) {
        if (data.data.grupales.length > 0) {
          if (data.data.grupales[0].subCategoria) { 
            if (data.data.grupales[0].subCategoria.length > 0) {
              let idCuestFam = data.data.grupales[0].subCategoria.find((x: any)=> x.idCuestSubCategoria == 1)
              if (idCuestFam) {
                if (idCuestFam.cuestionarios.length > 0) {
                  idCuestFam.cuestionarios.forEach((z: any)=>{
                    if (z.respuesta1) {
                      this.evaluacionService.formDataTestGij.controls.pregFam.setValue(z.idCuestionario);
                    }
                  })
                }
              }
              let idCuestRel = data.data.grupales[0].subCategoria.find((x: any)=> x.idCuestSubCategoria == 2)
              if (idCuestRel) {
                if (idCuestRel.cuestionarios.length > 0) {
                  idCuestRel.cuestionarios.forEach((z: any)=>{
                    if (z.respuesta1) {
                      this.evaluacionService.formDataTestGij.controls.pregRel.setValue(z.idCuestionario);
                    }
                  })
                }
              }
              let idCuestApo = data.data.grupales[0].subCategoria.find((x: any)=> x.idCuestSubCategoria == 3)
              if (idCuestApo) {
                if (idCuestApo.cuestionarios.length > 0) {
                  idCuestApo.cuestionarios.forEach((z: any)=>{
                    if (z.respuesta1) {
                      this.evaluacionService.formDataTestGij.controls.pregApo.setValue(z.idCuestionario);
                    }
                  })
                }
              }
              // Object.keys(this.evaluacionService.formDataTestKatz.controls).forEach((x: any, index)=>{
              //   let valor = (data.data.individuales[0].cuestionarios[index].respuesta1 == 1 ? 'SI' : data.data.individuales[0].cuestionarios[index].respuesta2 == 1 ? 'NO' : null);
              //   this.evaluacionService.formDataTestKatz.get(x).setValue(valor);
              // })
            }
          }
        }
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
    //  Test YESAVAGE
    this.evaluacionService.getRespuestasEvaluacion(this.getModel(4)).subscribe((data)=>{
      if (data.code == 0) {
        if (data.data.individuales.length > 0) {
          if (data.data.individuales[0].cuestionarios.length > 0) {
            Object.keys(this.evaluacionService.formDataTestYesa.controls).forEach((x: any, index)=>{
              let valor = (data.data.individuales[0].cuestionarios[index].respuesta1 == 1 ? 'SI' : data.data.individuales[0].cuestionarios[index].respuesta2 == 1 ? 'NO' : null);
              this.evaluacionService.formDataTestYesa.get(x).setValue(valor);
            })
          }
        }
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  getModel(pag: number): RequestEvaluacionRespuestas{
    return {
      tipoEvaluacion: JSON.parse(localStorage.getItem('datosEvaluacion')!).tipoEvaluacion,
      idOrigen: JSON.parse(localStorage.getItem('datosEvaluacion')!).idOrigen,
      idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      pagina: pag
    }
  }
}
