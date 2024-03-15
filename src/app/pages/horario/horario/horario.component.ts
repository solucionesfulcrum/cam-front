import { Component } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';
import { AppRoute } from 'src/app/data/constants/app-route.constant';

@Component({
  selector: 'esp-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.scss']
})
export class HorarioComponent {
  links: FormatoTab[] = [
    {url: `/app/${AppRoute.HORARIOS}`, title:'Administrar'},
    {url: `/app/${AppRoute.HORARIOS}/${AppRoute.HORARIOS_BUSCAR}`, title:'Buscar'},
    {url: `/app/${AppRoute.HORARIOS}/${AppRoute.HORARIOS_CONFIGURAR}`, title:'Configuraciones'},
  ]
}
