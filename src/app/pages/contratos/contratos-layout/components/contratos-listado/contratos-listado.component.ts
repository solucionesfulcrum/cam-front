import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { DialogNewContratoComponent } from '../dialog/dialog-new-contrato/dialog-new-contrato.component';

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

  constructor(private fb                      : FormBuilder, 
              private dialog                  : Dialog,
              private notificationService     : NotificationService,
              private router                  : Router, 
              private route                   : ActivatedRoute) { }


  nuevoContrato(){
    const dialogRef = this.dialog.open(DialogNewContratoComponent,{
      minWidth:'800px',
      maxWidth:'50%',
      data:{}
    })
    dialogRef.closed.subscribe(out =>{
      // console.log(out)
    })
  }
}
