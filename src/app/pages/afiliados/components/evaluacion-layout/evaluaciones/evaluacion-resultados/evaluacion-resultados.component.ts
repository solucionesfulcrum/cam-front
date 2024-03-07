import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RequestResultsEvaluacion, SendDataResultado } from '@models/afiliaciones/evaluaciones/evaluacion-evaluar.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { AfiliacionesEvaluacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-evaluaciones.service';
import { ContactosAfiliadosService } from 'src/app/data/services/contactos/contactos-afiliados.service';

@Component({
  selector: 'esp-evaluacion-resultados',
  templateUrl: './evaluacion-resultados.component.html',
  styleUrls: ['./evaluacion-resultados.component.scss']
})
export class EvaluacionResultadosComponent {
  faSpinner = faSpinner;
  dataSolicitud: any = true;
  dataFicha: any = Object();
  edadPersona: number = 0;
  status: RequestStatus = 'init';

  ready = false;
  datosResultados!: any;

  opcionesBotones: FormatoBoton[] = [
    {texto: 'Notas', esImagen: true, rutaIcono: 'assets/svg/iconFileEdit.svg'},
    {texto: 'Cancelar', colorBtn:'bordeado'},
    {texto: 'Finalizar Evaluación', colorBtn:'mezclado', loading: false},
  ];
  
  formResultados = this.fb.group({
    ctrlAdmitido: new FormControl(null, [Validators.required]),
    ctrlComentario: new FormControl(null, [Validators.required])
  });

  constructor(public fb                             : FormBuilder,
              public contactosAfiliadosService      : ContactosAfiliadosService,
              public notificationService            : NotificationService,
              public router                         : Router,
              public evaluacionService              : AfiliacionesEvaluacionesService){}

  ngOnInit(){
    this.getData()
  }

  sedData(){
    if (this.evaluacionService.formDataTestPfi.valid && this.evaluacionService.formDataTestKatz.valid && this.evaluacionService.formDataTestGij.valid && this.evaluacionService.formDataTestYesa.valid) {
      if (this.formResultados.valid) {
        this.status = 'loading';
        this.evaluacionService.registerResultsEvaluacion(this.getModelSend()).subscribe((data)=>{
          if (data.code == 0) {
            if (JSON.parse(localStorage.getItem('datosEvaluacion')!).tipoEvaluacion == 'SOLICITUD') {
              this.router.navigate(['app/afiliados']);
              this.notificationService.success('Se ha registrado la evaluación sobre la ficha de solicitud');
            }
            else if (JSON.parse(localStorage.getItem('datosEvaluacion')!).tipoEvaluacion == 'FICHA_ADMISION'){
              this.router.navigate(['app/contactos']);
              this.notificationService.success('Se ha registrado la evaluación sobre la ficha de asegurado');
            }
            this.status = 'success';
          }
          else{
            this.notificationService.warning(data.message);
            this.status = 'failed';
          }
        })
      }
      else{
        this.formResultados.markAllAsTouched();
      }
    }
    else{
      this.notificationService.warning('Quedan evaluaciones sin resolver, porfavor regrese a la vista anterior');
      this.evaluacionService.formDataTestPfi.markAllAsTouched();
      this.evaluacionService.formDataTestKatz.markAllAsTouched();
      this.evaluacionService.formDataTestGij.markAllAsTouched();
      this.evaluacionService.formDataTestYesa.markAllAsTouched();
    }
  }

  getModelSend(): SendDataResultado{
    return {
      tipoEvaluacion: JSON.parse(localStorage.getItem('datosEvaluacion')!).tipoEvaluacion,
      idOrigen: JSON.parse(localStorage.getItem('datosEvaluacion')!).idOrigen,
      idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      admitido: this.formResultados.controls.ctrlAdmitido.value == 'Si' ? true : false,
      comentario: this.formResultados.controls.ctrlComentario.value!
    }
  }

  getData(){
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
      this.evaluacionService.getResultsEvaluacion(this.getModel()).subscribe((data)=>{
        if (data.code == 0) {
          this.datosResultados = data.data;
          console.log(data.data)
        }
        else{
          this.notificationService.warning(data.message);
        }
      })
    }
  }

  getModel(): RequestResultsEvaluacion{
    return {
      tipoEvaluacion: JSON.parse(localStorage.getItem('datosEvaluacion')!).tipoEvaluacion,
      idOrigen: JSON.parse(localStorage.getItem('datosEvaluacion')!).idOrigen,
      idUnidadOperativa: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      idFichaAdmision: JSON.parse(localStorage.getItem('idFichaEvaluada')!)
    }
  }
}
