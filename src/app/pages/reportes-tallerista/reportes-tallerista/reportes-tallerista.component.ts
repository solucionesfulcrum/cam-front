import { Component } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { AppVariables } from 'src/app/data/constants/app-variables.constant';

@Component({
  selector: 'esp-reportes-tallerista',
  templateUrl: './reportes-tallerista.component.html',
  styleUrls: ['./reportes-tallerista.component.scss']
})
export class ReportesTalleristaComponent {
  dataUnidSelect: any = JSON.parse(localStorage.getItem("UnidElegida")!);
  links: FormatoTab[] = [
    {url: `/app/reportes-tallerista/${AppRoute.REPORTES_TALLERES_TALLERISTAS}`, title: 'Talleres'},
  ];

  ngOnInit(){
    if (this.dataUnidSelect.idRol == AppVariables.ID_ROL_TALLERISTA_TERCERO) {
      this.links.push({url: `/app/reportes-tallerista/${AppRoute.REPORTES_ASISTENCIAS_PROGRAMADAS}`, title: 'Asistencias Programadas'});
      this.links.push({url: `/app/reportes-tallerista/${AppRoute.REPORTES_ASISTENCIA_RAPIDA}`, title: 'Asistencia Rápida'});
    }
  }
}
