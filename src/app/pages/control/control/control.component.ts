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
    if (this.userInfo.idRol == 7 || this.userInfo.idRol === 1) {
      this.links = [
        {url: `/app/control/mis-talleres`, title: 'Mis Talleres'},
        {url: `/app/control/control-asistencia`, title: 'Asistencias', disabled: true},
        {url: `/app/control/control-talleres`, title: 'Control'},
        {url: `/app/control/asistencia-rapida`, title: 'Asistencia Rápida'},
      ];
    }
    else if(this.userInfo.idRol == 9){
      this.links = [
        {url: `/app/control`, title: 'Programados'},
        {url: `/app/control/en-calendario`, title: 'Calendario'},
        /*{url: `/app/control/mis-talleres-2`, title: 'Externos'},
        {url: `/app/control/mis-talleres-3`, title: 'Talleres'},*/
        {url: `/app/control/asistencias-profesional-cam`, title: 'Pre-Registro', disabled: true},
        {url: `/app/control/control-asistencia`, title: 'Asistencias', disabled: true},
        {url: `/app/control/asistencia-rapida`, title: 'Asistencia Rápida'},
      ];
    }
    else{
      this.links = [
        {url: `/app/control`, title: 'Programados'},
      ];
    }
  }
}
