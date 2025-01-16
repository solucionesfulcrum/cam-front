import { Component } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';

@Component({
  selector: 'esp-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss']
})
export class ParametrosComponent {
  links: FormatoTab[] = [
    {url:'/app/admin/parametros/lista-parametros', title:'Parametros'},
  ]
}
