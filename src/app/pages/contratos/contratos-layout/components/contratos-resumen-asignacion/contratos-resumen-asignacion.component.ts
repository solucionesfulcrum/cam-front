import { Component } from '@angular/core';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { AppRoute } from 'src/app/data/constants/app-route.constant';

@Component({
  selector: 'esp-contratos-resumen-asignacion',
  templateUrl: './contratos-resumen-asignacion.component.html',
  styleUrls: ['./contratos-resumen-asignacion.component.scss']
})
export class ContratosResumenAsignacionComponent {
  rutas = AppRoute;

  opcionesBotones: FormatoBoton[] = [
    {texto: 'Eliminar Contrato', colorBtn: 'bordeado'},
    {texto: 'Editar', colorBtn: 'bordeado'},
    {texto: 'Confirmar Contrato', colorBtn:'mezclado', deshabilitado: true},
  ];  

}
