import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { DialogNewContratoComponent } from '../dialog/dialog-new-contrato/dialog-new-contrato.component';
import { ContratosAdministracionService } from 'src/app/data/services/contratos/contratos-administracion.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'esp-contratos-listado',
  templateUrl: './contratos-listado.component.html',
  styleUrls: ['./contratos-listado.component.scss']
})
export class ContratosListadoComponent {
  faSpinner = faSpinner;
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
  dataListCams!: any;


  camElegido: any;

  constructor(private fb                      : FormBuilder, 
              private dialog                  : Dialog,
              private contratosService        : ContratosAdministracionService,
              private notificationService     : NotificationService,
              private router                  : Router, 
              private route                   : ActivatedRoute) { }
              
  ngOnInit(){
    this.contratosService.getListCamById().subscribe((data)=>{
      if (data.code == 0) {
        console.log(data.data[0])
        this.dataListCams = data.data[0];
        this.dataListCams.listarCam.forEach((x: any)=> x.activo = false);
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

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
