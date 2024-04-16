import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  numOc!: string;
  rutasContrato=[
    {url:`/app/programacion/show/${this.numOc}`, title:'Servicios Contratados'},
    {url:`/app/programacion/show/${this.numOc}/programados`, title:'Servicios Programados'},
  ];
  faSpinner = faSpinner;
  dataContrato: any;
  
  constructor(private activeRoute                           : ActivatedRoute,
              private programacionService                   : ProgramacionContratosService,
              private router                                : Router,
              private notificationService                   : NotificationService
  ) { 
    this.numOc = this.activeRoute.snapshot.paramMap.get('numOc')!;
    this.rutasContrato[0].url = `/app/programacion/show/${this.numOc}`;
    this.rutasContrato[1].url = `/app/programacion/show/${this.numOc}/programados`;
  }

  ngOnInit(){
    this.programacionService.getDatosContrato(this.numOc).subscribe((data)=>{
      if (data.code == 0) {
        this.dataContrato = data.data;
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }
  goToProgramacion(){
    this.router.navigate(['app/programacion/programacion-horarios/' + this.numOc])
  }
}
