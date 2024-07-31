import { Component } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';
import { AppRoute } from 'src/app/data/constants/app-route.constant';

@Component({
  selector: 'esp-programacion-layout',
  templateUrl: './programacion-layout.component.html',
  styleUrls: ['./programacion-layout.component.scss']
})
export class ProgramacionLayoutComponent {
  links: FormatoTab[] = [
    {url: `/app/${AppRoute.PROGRAMACION}`, title: 'Contratos'},
  ];


}
