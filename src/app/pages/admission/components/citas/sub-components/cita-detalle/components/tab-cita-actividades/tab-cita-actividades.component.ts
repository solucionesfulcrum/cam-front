import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdmisionCitasService } from '@services/admision/admision-citas.service';
import { NotificationService } from '@services/notification.service';
import { FormatoCartilla } from '@shared/components/cartilla-info/formato-cartilla.model';

@Component({
  selector: 'esp-tab-cita-actividades',
  templateUrl: './tab-cita-actividades.component.html',
  styleUrls: ['./tab-cita-actividades.component.scss']
})
export class TabCitaActividadesComponent {

  idHistoria = '';

  citasAsignadas: any[] = [];

  citasModificadas: FormatoCartilla[] = [];

  constructor(private activeRoute                   : ActivatedRoute,
              private notificationService           : NotificationService,
              private _admisionCitasService         : AdmisionCitasService) {
                // console.log(this.activeRoute.snapshot.paramMap)
      this.idHistoria = this.activeRoute.snapshot.paramMap.get('idHist')!;
    }

  ngOnInit(): void{
    this._admisionCitasService.getCitasOfFicha(this.idHistoria).subscribe((data)=>{
      if (data.code == 0) {
        this.citasAsignadas = data.data;
        // console.log(data)
        this.citasAsignadas.forEach((x, index)=>{
          let modificado: FormatoCartilla = {idActividad: index, actividadNombre: x.actividad, estadoCartilla: x.estado, fechaCreacion: new Date(), ingresaImagen: false};
          this.citasModificadas.push(modificado)
          // modificado = {actividadNombre: x.actividad, estadoCartilla: 'ATENDIDO', fechaCreacion: new Date(), ingresaImagen: false, fechaProgramadaInicio: new Date('2023-11-05 02:15 PM'), fechaProgramadaFin: new Date('2023-11-05 03:15 PM'), duracionAtencion: '15 Min', nombrePersona: 'Tany Maireth Orihuela Alegre', numeroPersona: '949 451 724'};
          // this.citasModificadas.push(modificado)
          // modificado = {actividadNombre: x.actividad, estadoCartilla: 'NO ATENDIDA', fechaCreacion: new Date(), ingresaImagen: false, fechaProgramadaInicio: new Date('2023-11-05 02:15 PM'), fechaProgramadaFin: new Date('2023-11-05 03:15 PM'), nombrePersona: 'Tany Maireth Orihuela Alegre', numeroPersona: '949 451 724'};
          // this.citasModificadas.push(modificado)
          // modificado = {actividadNombre: x.actividad, estadoCartilla: 'PROGRAMADO', fechaCreacion: new Date(), ingresaImagen: false, fechaProgramadaInicio: new Date('2023-11-05 02:15 PM'), fechaProgramadaFin: new Date('2023-11-05 03:15 PM'), nombrePersona: 'Tany Maireth Orihuela Alegre', numeroPersona: '949 451 724'};
          // this.citasModificadas.push(modificado)
          // modificado = {actividadNombre: x.actividad, estadoCartilla: 'CREADO', fechaCreacion: new Date(), ingresaImagen: true, imagenBase64: img};
          // this.citasModificadas.push(modificado)
        })
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }
}
