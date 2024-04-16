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
        console.log(data.data)
        if (data.data.serviciosCam) {this.serviciosContratados = data.data.serviciosCam}
        if (data.data.cirams) {this.serviciosCiramContratados = data.data.cirams}
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

}
