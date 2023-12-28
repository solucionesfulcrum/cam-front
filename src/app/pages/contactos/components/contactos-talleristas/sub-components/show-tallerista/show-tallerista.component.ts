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
    {texto: 'Editar', esImagen: true, rutaIcono: 'assets/svg/iconFileEdit.svg'},
    {texto: 'Activar', colorBtn:'mezclado'},
  ];


  tipoDoc: string = '';
  numDoc: string = '';
  rutasTallerista=[
    {url:`/app/contactos/talleristas/show/${this.tipoDoc}/${this.numDoc}`, title:'Parámetros'},
    {url:`/app/contactos/talleristas/show/${this.tipoDoc}/${this.numDoc}/horarios`, title:'Horarios'}
  ];

  dataTallerista: any;
  faSpinner = faSpinner;

  constructor(private activeRoute                   : ActivatedRoute,) { 
    this.tipoDoc = this.activeRoute.snapshot.paramMap.get('tipoDoc')!;
    this.numDoc = this.activeRoute.snapshot.paramMap.get('numDoc')!;
    this.rutasTallerista[0].url = `/app/contactos/talleristas/show/${this.tipoDoc}/${this.numDoc}`;
    this.rutasTallerista[1].url = `/app/contactos/talleristas/show/${this.tipoDoc}/${this.numDoc}/horarios`;
  }

  ngOnInit(): void {
    this.dataTallerista = 'asd';
  }

}
