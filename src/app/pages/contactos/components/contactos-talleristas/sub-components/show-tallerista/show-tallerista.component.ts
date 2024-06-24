import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@services/notification.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { ContactosTalleristasService } from 'src/app/data/services/contactos/contactos-talleristas.service';

@Component({
  selector: 'app-show-tallerista',
  templateUrl: './show-tallerista.component.html',
  styleUrls: ['./show-tallerista.component.css']
})
export class ShowTalleristaComponent implements OnInit {
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Cancelar'},
    {texto: 'Suspender', colorBtn: 'bordeado'},
    {texto: 'Contratar', colorBtn:'mezclado'},
  ];

  idTallerista: string = '';
  rutasTallerista=[
    {url:`/app/contactos/talleristas/show/${this.idTallerista}`, title:'Contratos'},
    {url:`/app/contactos/talleristas/show/${this.idTallerista}/calendarios`, title:'Calendario'},
    {url:`/app/contactos/talleristas/show/${this.idTallerista}/talleres`, title:'Talleres'},
    {url:`/app/contactos/talleristas/show/${this.idTallerista}/evaluaciones`, title:'Evaluaciones'}
  ];

  dataTallerista: any;
  faSpinner = faSpinner;

  constructor(private activeRoute                           : ActivatedRoute,
              private talleristaService                     : ContactosTalleristasService,
              private notificationService                   : NotificationService,
  ) { 
    this.idTallerista = this.activeRoute.snapshot.paramMap.get('idTallerista')!;
    this.rutasTallerista[0].url = `/app/contactos/talleristas/show/${this.idTallerista}`;
    this.rutasTallerista[1].url = `/app/contactos/talleristas/show/${this.idTallerista}/calendarios`;
    this.rutasTallerista[2].url = `/app/contactos/talleristas/show/${this.idTallerista}/talleres`;
    this.rutasTallerista[3].url = `/app/contactos/talleristas/show/${this.idTallerista}/evaluaciones`;
  }

  ngOnInit(): void {
    this.talleristaService.getDataTallerista(this.idTallerista).subscribe((data)=>{
      if (data.code == 0) {
        //console.log(data.data)
        this.dataTallerista = data.data;
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

}
