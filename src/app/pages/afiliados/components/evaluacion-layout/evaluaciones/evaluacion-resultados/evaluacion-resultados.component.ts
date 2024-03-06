import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
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

  ready = false;

  opcionesBotones: FormatoBoton[] = [
    {texto: 'Notas', esImagen: true, rutaIcono: 'assets/svg/iconFileEdit.svg'},
    {texto: 'Cancelar', colorBtn:'bordeado'},
    {texto: 'Finalizar Evaluación', colorBtn:'mezclado', loading: false},
  ];
  
  formResultados = this.fb.group({
    ctrlAdmitido: new FormControl(null),
    ctrlComentario: new FormControl(null)
  });

  resultadosPfi: any = Object();
  resultadosKatz: any = Object();
  resultadosGij: any = Object();
  resultadosYes: any = Object();

  constructor(public fb                             : FormBuilder,
              public contactosAfiliadosService      : ContactosAfiliadosService,
              public notificationService            : NotificationService,
              public evaluacionService              : AfiliacionesEvaluacionesService){}

  ngOnInit(){
    this.getData()
    this.calculateResults();
    console.log(this.evaluacionService.formDataTestPfi.value)
  }

  getData(){
    if (JSON.parse(localStorage.getItem('idFichaEvaluada')!) != null){
      this.contactosAfiliadosService.obtenerFichaAsegurado(JSON.parse(localStorage.getItem('idFichaEvaluada')!)).subscribe((data)=>{
        if (data.code == 0) {
          this.dataFicha = data.data;
          var dateObject = new Date(data.data.asegurado.fecNacimiento); 
          var timeDiff = Math.abs(Date.now() - dateObject.getTime());
          this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
          console.log(this.dataFicha);
          this.ready = true;
        }
        else{
          this.notificationService.warning(data.message);
        }
      })
    }
  }
  calculateResults(){
    this.resultadosPfi.countSi = Object.keys(this.evaluacionService.formDataTestPfi.value).filter(x => this.evaluacionService.formDataTestPfi.value[x] == 'BIEN').length;
    this.resultadosPfi.countMal = Object.keys(this.evaluacionService.formDataTestPfi.value).filter(x => this.evaluacionService.formDataTestPfi.value[x] == 'MAL').length;
    this.resultadosPfi.resultado = 'Valoración Cognitiva normal';
    this.resultadosKatz.countSi = Object.keys(this.evaluacionService.formDataTestKatz.value).filter(x => this.evaluacionService.formDataTestKatz.value[x] == 'SI').length;
    this.resultadosKatz.countMal = Object.keys(this.evaluacionService.formDataTestKatz.value).filter(x => this.evaluacionService.formDataTestKatz.value[x] == 'NO').length;
    this.resultadosKatz.resultado = 'Independiente';
    this.resultadosYes.countSi = Object.keys(this.evaluacionService.formDataTestYesa.value).filter(x => this.evaluacionService.formDataTestYesa.value[x] == 'SI').length;
    this.resultadosYes.countMal = Object.keys(this.evaluacionService.formDataTestYesa.value).filter(x => this.evaluacionService.formDataTestYesa.value[x] == 'NO').length;
    this.resultadosYes.resultado = 'Normal';
  }

}
