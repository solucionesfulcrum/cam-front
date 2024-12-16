import { Component } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';

@Component({
  selector: 'esp-gestion-servicios',
  templateUrl: './gestion-servicios.component.html',
  styleUrls: ['./gestion-servicios.component.scss']
})
export class GestionServiciosComponent {
  links: FormatoTab[] = [
    {url:'/app/admin/gestion-servicios/lista-servicios', title:'Servicios'},
    {url:'/app/admin/gestion-servicios/lista-sub-programas', title:'Sub-programas'},
    {url:'/app/admin/gestion-servicios/lista-programas', title:'Programas'},
    {url:'/app/admin/gestion-servicios/lista-servicios-inactivos', title:'Servicos Inactivos'}
  ]
}
