import { Component } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';
import { AppRoute } from 'src/app/data/constants/app-route.constant';

@Component({
  selector: 'esp-reportes-tallerista',
  templateUrl: './reportes-tallerista.component.html',
  styleUrls: ['./reportes-tallerista.component.scss']
})
export class ReportesTalleristaComponent {
  links: FormatoTab[] = [
    {url: `/app/reportes-tallerista/${AppRoute.REPORTES_TALLERES_TALLERISTAS}`, title: 'Talleres'},
  ];
}
