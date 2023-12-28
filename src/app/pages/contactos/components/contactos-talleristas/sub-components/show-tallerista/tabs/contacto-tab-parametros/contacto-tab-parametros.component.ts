import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacto-tab-parametros',
  templateUrl: './contacto-tab-parametros.component.html',
  styleUrls: ['./contacto-tab-parametros.component.css']
})
export class ContactoTabParametrosComponent implements OnInit {

  opcionesProcesos: any[] = [
    { procesoId: 1, nombre: 'Rehabilitación profesional', categoria: 'UNIDAD', orden: 1, usuarioRegId: 1, usuarioModId: null, fechReg: '2023-09-19T17:42:31.197', fechMod: null, activo: 1},
    { procesoId: 2, nombre: 'Rehabilitación social', categoria: 'UNIDAD', orden: 2, usuarioRegId: 1, usuarioModId: null, fechReg: '2023-09-19T17:42:31.197', fechMod: null, activo: 1},
    { procesoId: 3, nombre: 'Evaluación Inicial', categoria: 'UNIDAD', orden: 3, usuarioRegId: 1, usuarioModId: null, fechReg: '2023-09-19T17:42:31.197', fechMod: null, activo: 1},
    { procesoId: 4, nombre: 'Otras Actividades', categoria: 'GENERICO', orden: 4, usuarioRegId: 1, usuarioModId: null, fechReg: '2023-09-19T17:42:31.197', fechMod: null, activo: 1}
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
