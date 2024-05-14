import { Component } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';

@Component({
  selector: 'esp-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent {
  
  userInfo = (JSON.parse(localStorage.getItem('UnidElegida')!));
  links: FormatoTab[] = []
  ngOnInit(){
    if (this.userInfo.rol === 'TALLERISTA') {
      this.links = [
        {url: `/app/control/mis-talleres`, title: 'Mis Talleres'},
        {url: `/app/control/control-asistencia`, title: 'Asistencias'},
      ];
    }
    else{
      this.links = [
        {url: `/app/control`, title: 'Programados'},
      ];
    }
  }
}
