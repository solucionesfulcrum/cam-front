import { Component } from '@angular/core';

@Component({
  selector: 'esp-unidades-operativas-main',
  templateUrl: './unidades-operativas-main.component.html',
  styleUrls: ['./unidades-operativas-main.component.scss']
})
export class UnidadesOperativasMainComponent {
  titulo: string='Unidades Operativas';
  links=[
    {url:'/app/admin/unidades-operativas', title: 'CAM'},
    {url:'/app/admin/unidades-operativas/ciram', title: 'CIRAM'},
  ]
}
