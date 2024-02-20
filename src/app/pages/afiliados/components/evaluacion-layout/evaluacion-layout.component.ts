import { Component } from '@angular/core';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';

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

}
