import { Component } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';

@Component({
  selector: 'esp-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent {
  links: FormatoTab[] = [
    {url:'/app/contact', title:'Profesionales'},
    {url:'/app/contact/rps-users', title:'Usuarios RPS'},
    {url:'/app/contact/allies', title:'Aliados'},
  ]
}
