import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@services/notification.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { ProgramacionContratosService } from 'src/app/data/services/programacion/programacion-contratos.service';

@Component({
  selector: 'esp-programacion-show-contrato',
  templateUrl: './programacion-show-contrato.component.html',
  styleUrls: ['./programacion-show-contrato.component.scss']
})
export class ProgramacionShowContratoComponent {
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Programar', colorBtn:'mezclado'},
  ];
  faSpinner = faSpinner;
  numOc!: string;
  dataContrato: any;
  
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
        this.dataContrato = data.data;
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

}
