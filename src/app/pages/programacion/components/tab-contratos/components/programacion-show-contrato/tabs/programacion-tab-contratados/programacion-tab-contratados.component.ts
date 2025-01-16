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
  idProgramacion!: string;

  serviciosContratados: any[] = [];
  serviciosCiramContratados: any[] = [];

  constructor(private activeRoute                           : ActivatedRoute,
              private programacionService                   : ProgramacionContratosService,
              private notificationService                   : NotificationService
  ) { 
    this.idProgramacion = this.activeRoute.snapshot.paramMap.get('idProgramacion')!;
  }

  ngOnInit(){
    this.programacionService.getDatosServicioContrato(this.idProgramacion).subscribe((datos)=>{
      if (datos.code == 0) {
        if (datos.data.serviciosCam) {this.serviciosContratados = datos.data.serviciosCam.servicios}
        if (datos.data.serviciosCirams) {this.serviciosCiramContratados = datos.data.serviciosCirams; 
          //console.log(this.serviciosCiramContratados)

        }
      }
      else {
        this.notificationService.warning(datos.message);
      }
    })
  }

}
