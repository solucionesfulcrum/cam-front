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
    }
    else{
      this.getRespuestas();
      console.log(JSON.parse(localStorage.getItem('idFichaEvaluada')!))
    }
  }

  ngOnDestroy(){
    localStorage.removeItem('idFichaEvaluada');
    this.evaluacionService.formDataTestPfi.reset();
    this.evaluacionService.formDataTestKatz.reset();
    this.evaluacionService.formDataTestGij.reset();
    this.evaluacionService.formDataTestYesa.reset();
  }

  getRespuestas(){
    //  Test Pfeiffer
    this.evaluacionService.getRespuestasEvaluacion(this.getModel(1)).subscribe((data)=>{
      if (data.code == 0) {
        if (data.data.individuales[0].cuestionarios.length > 0) {
          Object.keys(this.evaluacionService.formDataTestPfi.controls).forEach((x: any, index)=>{
            let valor = (data.data.individuales[0].cuestionarios[index].respuesta1 == 1 ? 'BIEN' : data.data.individuales[0].cuestionarios[index].respuesta2 == 1 ? 'MAL' : null);
            this.evaluacionService.formDataTestPfi.get(x).setValue(valor);
          })
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
          console.log(data.data)
          Object.keys(this.evaluacionService.formDataTestKatz.controls).forEach((x: any, index)=>{
            let valor = (data.data.individuales[0].cuestionarios[index].respuesta1 == 1 ? 'SI' : data.data.individuales[0].cuestionarios[index].respuesta2 == 1 ? 'NO' : null);
            this.evaluacionService.formDataTestKatz.get(x).setValue(valor);
          })
        }
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  getModel(pag: number): RequestEvaluacionRespuestas{
    return {
      idFichaAdmision: JSON.parse(localStorage.getItem('idFichaEvaluada')!),
      idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      pagina: pag
    }
  }
}
