import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { ProgramacionContratosService } from 'src/app/data/services/programacion/programacion-contratos.service';

@Component({
  selector: 'esp-programacion-tab-contratados',
  templateUrl: './programacion-tab-contratados.component.html',
  styleUrls: ['./programacion-tab-contratados.component.scss']
})
export class ProgramacionTabContratadosComponent {
  numOc!: string;

  serviciosContratados: any[] = [];
  serviciosCiramContratados: any[] = [];

  constructor(private activeRoute                           : ActivatedRoute,
              private programacionService                   : ProgramacionContratosService,
              private notificationService                   : NotificationService
  ) { 
    this.numOc = this.activeRoute.snapshot.paramMap.get('numOc')!;
  }

  ngOnInit(){
    this.programacionService.getDatosContrato(this.numOc).subscribe((data)=>{
      if (data.code == 0) {
        this.programacionService.getDatosServicioContrato(data.data.datosContrato.idProgramacion).subscribe((datos)=>{
          if (datos.code == 0) {
            if (datos.data.serviciosCam) {this.serviciosContratados = datos.data.serviciosCam.servicios}
            if (datos.data.cirams) {this.serviciosCiramContratados = datos.data.cirams}
          }
          else {
            this.notificationService.warning(datos.message);
          }
        })
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

}
