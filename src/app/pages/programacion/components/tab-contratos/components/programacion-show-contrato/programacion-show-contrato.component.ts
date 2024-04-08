import { Component } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';

@Component({
  selector: 'esp-programacion-show-contrato',
  templateUrl: './programacion-show-contrato.component.html',
  styleUrls: ['./programacion-show-contrato.component.scss']
})
export class ProgramacionShowContratoComponent {
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Programar', colorBtn:'mezclado'},
  ];
  faSpinner = faSpinner;
  dataContrato: any;

}
