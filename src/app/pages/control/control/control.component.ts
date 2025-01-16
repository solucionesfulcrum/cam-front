import { Component, OnInit } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'esp-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss'],
})
export class ControlComponent implements OnInit {
  userInfo = JSON.parse(localStorage.getItem('UnidElegida')!);
  links: FormatoTab[] = [];

  constructor(private datosGeneralesService: DatosGeneralesService) {}

  ngOnInit(): void {
    // Inicializar los links con sus valores predeterminados
    this.initializeLinks();

    // Verificar el estado de "Asistencia Rápida" y actualizar los links si es necesario
    this.updateAsistenciaRapidaStatus();
  }

  initializeLinks(): void {
    if (this.userInfo.idRol === 7 || this.userInfo.idRol === 1) {
      this.links = [
        { url: `/app/control/mis-talleres`, title: 'Mis Talleres' },
        { url: `/app/control/control-asistencia`, title: 'Asistencias', disabled: true },
        { url: `/app/control/control-talleres`, title: 'Control' },
        { url: `/app/control/asistencia-rapida`, title: 'Asistencia Rápida' },
      ];
    } else if (this.userInfo.idRol === 9) {
      this.links = [
        { url: `/app/control`, title: 'Programados' },
        { url: `/app/control/en-calendario`, title: 'Calendario' },
        { url: `/app/control/asistencias-profesional-cam`, title: 'Pre-Registro', disabled: true },
        { url: `/app/control/control-asistencia`, title: 'Asistencias', disabled: true },
        { url: `/app/control/asistencia-rapida`, title: 'Asistencia Rápida' },
      ];
    } else {
      this.links = [{ url: `/app/control`, title: 'Programados' }];
    }
  }

  updateAsistenciaRapidaStatus(): void {
    this.datosGeneralesService.consultaActivacionApp('SASFLTYO2314').subscribe({
      next: (response: any) => {
        const asistenciaRapidaActiva = response?.data?.activa ?? false;
        const mensajeAsistenciaRapidaDisabled = response?.data?.mensaje ?? '';

        // Actualizar solo el estado de "Asistencia Rápida"
        this.links = this.links.map((link) =>
          link.title === 'Asistencia Rápida'
            ? { ...link, disabled: !asistenciaRapidaActiva, messageDisabled: mensajeAsistenciaRapidaDisabled }
            : link
        );
      },
      error: () => {
        console.error('Error al verificar el estado de Asistencia Rápida.');
      },
    });
  }
}
