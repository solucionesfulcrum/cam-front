import { Component } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';

@Component({
  selector: 'esp-admin-contactos',
  templateUrl: './admin-contactos.component.html',
  styleUrls: ['./admin-contactos.component.scss']
})
export class AdminContactosComponent {
  links: FormatoTab[] = [
    {url:'/app/admin/contactos/asegurados', title:'Asegurados'},
    {url:'/app/admin/contactos/evaluaciones', title:'Evaluaciones'},
  ]
}
