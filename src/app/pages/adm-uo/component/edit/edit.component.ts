import { Component } from '@angular/core';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'esp-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  nombreCam = '';
  dataShow = false;
  faSpinner = faSpinner;
  id = 1;
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Cancelar'},
    {texto: 'Editar', esImagen: true, rutaIcono: 'assets/svg/iconFileEdit.svg'},
  ];
  links=[
    {url:`/app/contactos/show/${this.id}`, title:'Afilidados'},
    {url:`/app/contactos/show/${this.id}`, title:'Talleres'},
    {url:`/app/contactos/show/${this.id}`, title:'Talleristas'},
  ]
  ngOnInit() {
    this.nombreCam = (JSON.parse(localStorage.getItem('UnidElegida')!)).unidOperativa
  }
}
