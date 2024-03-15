import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdmisionCitasService } from '@services/admision/admision-citas.service';
import { FormatoCartilla } from '@shared/components/cartilla-info/formato-cartilla.model';

@Component({
  selector: 'esp-tab-cita-historial',
  templateUrl: './tab-cita-historial.component.html',
  styleUrls: ['./tab-cita-historial.component.scss']
})
export class TabCitaHistorialComponent {
  idHistoria = '';

  citasAtendidas: any[] = [];
  citasModificadas: FormatoCartilla[] = [];

  constructor(private citasService                  : AdmisionCitasService,
              private activeRoute                   : ActivatedRoute){
      this.idHistoria = this.activeRoute.parent?.snapshot.paramMap.get('idHist')!;
  }
  ngOnInit(){
    this.citasAtendidas = this.citasService.getHistorialActividadesFicha(parseInt(this.idHistoria));
    this.citasAtendidas.forEach((x)=>{
      let cartilla: FormatoCartilla = {
        idActividad: x.idActividad,
        actividadNombre: x.nombreActividad,
        estadoCartilla: x.historial[x.historial.length-1].estadoAtencion,
        fechaCreacion: x.historial[x.historial.length-1].fecha,
        ingresaImagen: false,
        fechaProgramadaInicio: x.historial[x.historial.length-1].horaInicio,
        fechaProgramadaFin: x.historial[x.historial.length-1].horaFin,
        duracionAtencion: x.historial[x.historial.length-1].duracion,
        nombrePersona: x.historial[x.historial.length-1].profesional,
        numeroPersona: x.historial[x.historial.length-1].numProfesional
      };
      this.citasModificadas.push(cartilla);
    })
  }
}
