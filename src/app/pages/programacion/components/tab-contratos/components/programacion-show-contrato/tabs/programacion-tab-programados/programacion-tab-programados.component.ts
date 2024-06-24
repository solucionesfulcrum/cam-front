import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { ProgramacionContratosService } from 'src/app/data/services/programacion/programacion-contratos.service';

@Component({
  selector: 'esp-programacion-tab-programados',
  templateUrl: './programacion-tab-programados.component.html',
  styleUrls: ['./programacion-tab-programados.component.scss']
})
export class ProgramacionTabProgramadosComponent {
  idProgramacion!: string;

  serviciosProgramados: any[] = [];

  constructor(private activeRoute                           : ActivatedRoute,
              private programacionService                   : ProgramacionContratosService,
              private notificationService                   : NotificationService
  ) {
    this.idProgramacion = this.activeRoute.parent!.snapshot.paramMap.get('idProgramacion')!;
  }

  ngOnInit(){
    this.programacionService.getServiciosProgramados(this.idProgramacion).subscribe((datos)=>{
      if (datos.code == 0) {
        this.serviciosProgramados = datos.data;
        //console.log(this.serviciosProgramados)
      }
      else {
        this.notificationService.warning(datos.message);
      }
    })
  }

}
