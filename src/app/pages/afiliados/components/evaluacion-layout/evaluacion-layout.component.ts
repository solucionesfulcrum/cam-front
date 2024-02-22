import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { AfiliacionesEvaluacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-evaluaciones.service';

@Component({
  selector: 'esp-evaluacion-layout',
  templateUrl: './evaluacion-layout.component.html',
  styleUrls: ['./evaluacion-layout.component.scss']
})
export class EvaluacionLayoutComponent {
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Notas', esImagen: true, rutaIcono: 'assets/svg/iconFileEdit.svg'},
    {texto: 'Cancelar', colorBtn:'bordeado'},
    {texto: 'Guardar Evaluación', colorBtn:'mezclado', loading: false},
  ];

  constructor(public evaluacionService:               AfiliacionesEvaluacionesService){}

  ngOnInit(){
    
  }

  checkIfAnswered(fg: FormGroup): boolean{
    return Object.values(fg.value).every(value => {if (value == null) { return false } return true;});
  }
}
