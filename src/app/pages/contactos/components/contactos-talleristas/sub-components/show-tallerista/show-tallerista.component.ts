import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@services/notification.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { ContactosTalleristasService } from 'src/app/data/services/contactos/contactos-talleristas.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'app-show-tallerista',
  templateUrl: './show-tallerista.component.html',
  styleUrls: ['./show-tallerista.component.css']
})
export class ShowTalleristaComponent implements OnInit {
  opcionesBotones: FormatoBoton[] = [
    /*{texto: 'Cancelar'},
    {texto: 'Suspender', colorBtn: 'bordeado'},*/
    {texto: 'Contratar', colorBtn:'mezclado'},
  ];

  distrito: string = ''
  provincia: string = ''
  region: string = ''

  idTallerista: string = '';
  rutasTallerista=[
    {url:`/app/contactos/talleristas/show/${this.idTallerista}`, title:'Contratos'},
    /*{url:`/app/contactos/talleristas/show/${this.idTallerista}/calendarios`, title:'Calendario'},
    {url:`/app/contactos/talleristas/show/${this.idTallerista}/talleres`, title:'Talleres'},
    {url:`/app/contactos/talleristas/show/${this.idTallerista}/evaluaciones`, title:'Evaluaciones'}*/
  ];

  dataTallerista: any;
  faSpinner = faSpinner;

  constructor(private activeRoute                           : ActivatedRoute,
              private talleristaService                     : ContactosTalleristasService,
              private notificationService                   : NotificationService,
              private datosGenerales : DatosGeneralesService,
  ) { 
    this.idTallerista = this.activeRoute.snapshot.paramMap.get('idTallerista')!;
    this.rutasTallerista[0].url = `/app/contactos/talleristas/show/${this.idTallerista}`;
    //this.rutasTallerista[1].url = `/app/contactos/talleristas/show/${this.idTallerista}/calendarios`;
    //this.rutasTallerista[2].url = `/app/contactos/talleristas/show/${this.idTallerista}/talleres`;
    //this.rutasTallerista[3].url = `/app/contactos/talleristas/show/${this.idTallerista}/evaluaciones`;
  }

  setUbigeo(codUbigeo: string){
    this.datosGenerales.searchByUbigeo(codUbigeo).subscribe((rpta)=>{
      this.region = rpta.data.region;
      this.provincia = rpta.data.provincia;
      this.distrito = rpta.data.distrito;
    });
  }

  ngOnInit(): void {
    this.talleristaService.getDataTallerista(this.idTallerista).subscribe((data)=>{
      if (data.code == 0) {
        //console.log(data.data)
        this.setUbigeo(data.data.codRegion + data.data.codProvincia + data.data.codDistrito)
        this.dataTallerista = data.data;
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

}
