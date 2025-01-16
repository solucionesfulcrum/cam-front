import { Component } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';

@Component({
  selector: 'esp-asistencia-rapida',
  templateUrl: './asistencia-rapida.component.html',
  styleUrls: ['./asistencia-rapida.component.scss']
})
export class AsistenciaRapidaComponent {
  links: FormatoTab[] = [
    {url:'/app/admin/asistencia-rapida/talleristas', title:'Talleristas'},
    {url:'/app/admin/asistencia-rapida/profesional-cam', title:'Profesional Cam'},
    {url:'/app/admin/asistencia-rapida/unidades-operativas', title:'Unidades Operativas'},
  ]
}
