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
    else if(this.userInfo.rol == "PROFESIONAL CAM"){
      this.links = [
        {url: `/app/control`, title: 'Programados'},
        {url: `/app/control/en-calendario`, title: 'Calendario'},
        {url: `/app/control/mis-talleres-2`, title: 'Externos'},
        {url: `/app/control/mis-talleres-3`, title: 'Talleres'},
        {url: `/app/control/asistencias-profesional-cam`, title: 'Asistencias'},
      ];
    }
    else{
      this.links = [
        {url: `/app/control`, title: 'Programados'},
      ];
    }
  }
}
