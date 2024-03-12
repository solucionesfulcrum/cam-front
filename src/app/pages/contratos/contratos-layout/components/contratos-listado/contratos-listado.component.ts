import { Component } from '@angular/core';

@Component({
  selector: 'esp-contratos-listado',
  templateUrl: './contratos-listado.component.html',
  styleUrls: ['./contratos-listado.component.scss']
})
export class ContratosListadoComponent {
  listCams: any[] = [
    {nombreCam: 'CAM CUSCO', activo: false, listSub: [
      {nombreSub: 'CIRAN Cusco 1'},
      {nombreSub: 'CIRAN Cusco X'},
      {nombreSub: 'CIRAN Cusco b'},
      {nombreSub: 'CIRAN Cusco II'},
    ]},
    {nombreCam: 'CAM Quillabamba', activo: false, listSub: [
      {nombreSub: 'CIRAM Huyros'},
      {nombreSub: 'CIRAM Raya'},
      {nombreSub: 'CIRAM Hulla'}
    ]},
    {nombreCam: 'CIRAM Pichari', activo: false, listSub: [
      {nombreSub: 'CIRAM Huyros'},
      {nombreSub: 'CIRAM Raya'},
      {nombreSub: 'CIRAM Hulla'}
    ]},
    {nombreCam: 'CAM Urcos', activo: false, listSub: [
      {nombreSub: 'CIRAM Huyros'},
      {nombreSub: 'CIRAM Raya'},
      {nombreSub: 'CIRAM Hulla'}
    ]},
    {nombreCam: 'CAM Espinar', activo: false, listSub: [
      {nombreSub: 'CIRAM Huyros'},
      {nombreSub: 'CIRAM Raya'},
      {nombreSub: 'CIRAM Hulla'}
    ]},
  ];

  camElegido: any;
}
