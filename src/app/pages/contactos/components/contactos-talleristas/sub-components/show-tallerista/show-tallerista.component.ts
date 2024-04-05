import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';

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


  tipoDoc: string = '';
  numDoc: string = '';
  rutasTallerista=[
    {url:`/app/contactos/talleristas/show/${this.tipoDoc}/${this.numDoc}`, title:'Contratos'},
    {url:`/app/contactos/talleristas/show/${this.tipoDoc}/${this.numDoc}/calendarios`, title:'Calendario'},
    {url:`/app/contactos/talleristas/show/${this.tipoDoc}/${this.numDoc}/talleres`, title:'Talleres'},
    {url:`/app/contactos/talleristas/show/${this.tipoDoc}/${this.numDoc}/evaluaciones`, title:'Evaluaciones'}
  ];

  dataTallerista: any;
  faSpinner = faSpinner;

  constructor(private activeRoute                   : ActivatedRoute,) { 
    this.tipoDoc = this.activeRoute.snapshot.paramMap.get('tipoDoc')!;
    this.numDoc = this.activeRoute.snapshot.paramMap.get('numDoc')!;
    this.rutasTallerista[0].url = `/app/contactos/talleristas/show/${this.tipoDoc}/${this.numDoc}`;
    this.rutasTallerista[1].url = `/app/contactos/talleristas/show/${this.tipoDoc}/${this.numDoc}/calendarios`;
    this.rutasTallerista[2].url = `/app/contactos/talleristas/show/${this.tipoDoc}/${this.numDoc}/talleres`;
    this.rutasTallerista[3].url = `/app/contactos/talleristas/show/${this.tipoDoc}/${this.numDoc}/evaluaciones`;
  }

  ngOnInit(): void {
    this.dataTallerista = 'asd';
  }

}
