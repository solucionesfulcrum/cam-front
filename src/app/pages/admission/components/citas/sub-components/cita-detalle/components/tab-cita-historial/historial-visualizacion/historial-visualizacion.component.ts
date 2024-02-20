import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdmisionCitasService } from '@services/admision/admision-citas.service';
import { FormatoCartilla } from '@shared/components/cartilla-info/formato-cartilla.model';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';

@Component({
  selector: 'esp-historial-visualizacion',
  templateUrl: './historial-visualizacion.component.html',
  styleUrls: ['./historial-visualizacion.component.scss']
})
export class HistorialVisualizacionComponent {
  idHistoria = '';
  idCita = '';
  historialCita: any = Object();
  
  citasModificadas: FormatoCartilla[] = [];

  opcionesBotones: FormatoBoton[] = [
    {texto: 'Cancelar'}
  ]

 constructor(private citasService                  : AdmisionCitasService,
             private router                        : Router,
             private activeRoute                   : ActivatedRoute){
              this.idCita = this.activeRoute.snapshot.paramMap.get('idCita')!;
              this.idHistoria = this.activeRoute.snapshot.paramMap.get('idHist')!;
  }
  ngOnInit(){
    this.historialCita = this.citasService.actividadesFinalizadas.find((x)=>{return x.idActividad == parseInt(this.idCita)});
    this.historialCita.historial.forEach((x: any)=>{
      let cartilla: FormatoCartilla = {
        idActividad: x.id,
        actividadNombre: this.historialCita.nombreActividad,
        estadoCartilla: x.estadoAtencion,
        fechaCreacion: x.fecha,
        ingresaImagen: false,
        fechaProgramadaInicio: x.horaInicio,
        fechaProgramadaFin: x.horaFin,
        duracionAtencion: x.duracion,
        nombrePersona: x.profesional,
        numeroPersona: x.numProfesional
      };
      this.citasModificadas.push(cartilla);
    })
    console.log(this.citasModificadas)
  }
  
  funcionesExtra(opt: number){
    switch (opt) {
      case 0: // Cancelar
        this.router.navigate(['/app/admission/citas/'+this.idHistoria+'/historial']);
        break;
    }
  }
}
