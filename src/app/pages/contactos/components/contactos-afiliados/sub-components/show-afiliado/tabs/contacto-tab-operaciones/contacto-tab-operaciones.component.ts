import { registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-contacto-tab-operaciones',
  templateUrl: './contacto-tab-operaciones.component.html',
  styleUrls: ['./contacto-tab-operaciones.component.css'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class ContactoTabOperacionesComponent implements OnInit {

  pseudoInfoOperaciones: any[] = [
    {descripcion: 'Marco Asistencia en el taller de Yoga', fecha: new Date('2023-07-18 11:39 AM')},
    {descripcion: 'Marco Asistencia en el taller de Yoga', fecha: new Date('2023-07-12 11:39 AM')},
    {descripcion: 'Solicito unirse al proyecto CAM', fecha: new Date('2023-05-26 08:39 AM')},
    {descripcion: 'Finalizo la Evaluación siendo aceptado en el proyecto CAM', fecha: new Date('2023-05-26 11:39 AM')},
    {descripcion: 'Se le asigno al CAM lima Centro', fecha: new Date('2023-05-26 02:39 PM')},
  ];

  listaOperaciones: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.listaOperaciones = this.pseudoInfoOperaciones.reduce((groups, operacion) => {
      const date = operacion.fecha.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(operacion);
      return groups;
    }, {});
    this.listaOperaciones = Object.keys(this.listaOperaciones).map((fecha: any) => {
      return {
        fecha,
        operaciones: this.listaOperaciones[fecha]
      };
    });
  }

}
