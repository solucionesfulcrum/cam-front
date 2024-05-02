import { Component } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';

@Component({
  selector: 'esp-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent {
  links: FormatoTab[] = [
    {url: `/app/control`, title: 'Programados'},
    /*{url: `/app/`, title: 'En Calendario'},
    {url: `/app/`, title: 'Talleristas'},
    {url: `/app/`, title: 'Talleres'},
    {url: `/app/`, title: 'Asistencias'},*/
  ]
}
