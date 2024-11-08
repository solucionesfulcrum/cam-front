import { Component } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';

@Component({
  selector: 'esp-reportes-generados',
  templateUrl: './reportes-generados.component.html',
  styleUrls: ['./reportes-generados.component.scss']
})
export class ReportesGeneradosComponent {
  links: FormatoTab[] = [
    {url:'/app/admin/reportes-generados/reportes-excel', title:'Reportes Excel'},
  ]
}
