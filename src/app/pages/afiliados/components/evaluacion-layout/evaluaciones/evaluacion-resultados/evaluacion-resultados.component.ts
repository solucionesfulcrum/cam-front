import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { AfiliacionesEvaluacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-evaluaciones.service';

@Component({
  selector: 'esp-evaluacion-resultados',
  templateUrl: './evaluacion-resultados.component.html',
  styleUrls: ['./evaluacion-resultados.component.scss']
})
export class EvaluacionResultadosComponent {
  faSpinner = faSpinner;
  dataSolicitud: any = true;

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
              public evaluacionService              : AfiliacionesEvaluacionesService){}

  ngOnInit(){
    this.calculateResults();
  }

  calculateResults(){
    this.resultadosPfi.countSi = Object.keys(this.evaluacionService.formDataTestPfi.value).filter(x => this.evaluacionService.formDataTestPfi.value[x] == 'Bien').length;
    this.resultadosPfi.countMal = Object.keys(this.evaluacionService.formDataTestPfi.value).filter(x => this.evaluacionService.formDataTestPfi.value[x] == 'Mal').length;
    this.resultadosPfi.resultado = 'Valoración Cognitiva normal';
    this.resultadosKatz.countSi = Object.keys(this.evaluacionService.formDataTestKatz.value).filter(x => this.evaluacionService.formDataTestKatz.value[x] == 'Si').length;
    this.resultadosKatz.countMal = Object.keys(this.evaluacionService.formDataTestKatz.value).filter(x => this.evaluacionService.formDataTestKatz.value[x] == 'No').length;
    this.resultadosKatz.resultado = 'Independiente';
    this.resultadosYes.countSi = Object.keys(this.evaluacionService.formDataTestYesa.value).filter(x => this.evaluacionService.formDataTestYesa.value[x] == 'Si').length;
    this.resultadosYes.countMal = Object.keys(this.evaluacionService.formDataTestYesa.value).filter(x => this.evaluacionService.formDataTestYesa.value[x] == 'No').length;
    this.resultadosYes.resultado = 'Normal';
    Object.keys(this.evaluacionService.formDataTestPfi.value).filter(x => this.evaluacionService.formDataTestPfi.value[x] == 'Bien').length
  }

}
