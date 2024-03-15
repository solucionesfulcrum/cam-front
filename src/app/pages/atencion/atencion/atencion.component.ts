import { Component } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';
import { AppRoute } from 'src/app/data/constants/app-route.constant';

@Component({
  selector: 'esp-atencion',
  templateUrl: './atencion.component.html',
  styleUrls: ['./atencion.component.scss']
})
export class AtencionComponent {
  links: FormatoTab[] = [
    {url: `/app/${AppRoute.ATENCIONES}`, title: 'Apertura de citas', tituloOpcional: 'Citas Médicas'},
    {url: `/app/${AppRoute.ATENCIONES}/${AppRoute.ATENCIONES_PENDIENTES}`, title: 'Pendientes', tituloOpcional: 'Lista de pacientes'},
    {url: `/app/${AppRoute.ATENCIONES}/${AppRoute.ATENCIONES_ATENDIDOS}`, title: 'Atendidos'},
    {url: `/app/${AppRoute.ATENCIONES}/${AppRoute.ATENCIONES_NO_ATENDIDOS}`, title: 'No atendidos'},
    {url: `/app/${AppRoute.ATENCIONES}/${AppRoute.ATENCIONES_HISTORIAL}`, title: 'Historial'},
  ]
}
