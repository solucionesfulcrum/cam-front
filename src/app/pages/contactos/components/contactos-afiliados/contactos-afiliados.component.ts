import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { RequestListaSAfiliadosContacto,listaConstactosRequest } from '@models/afiliados/ficha-solicitud.model';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { DialogNewAseguradoComponent } from './sub-components/dialog/dialog-new-asegurado/dialog-new-asegurado.component';
import { NotificationService } from '@services/notification.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { Parametro } from '@models/parametros-busqueda.model';

@Component({
  selector: 'app-contactos-afiliados',
  templateUrl: './contactos-afiliados.component.html',
  styleUrls: ['./contactos-afiliados.component.css']
})
export class ContactosAfiliadosComponent implements OnInit {
  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
  });
  opciones: Parametro[] = [];
  dataSource: any[] = [];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;
  columns: string[] = ['marcar','nombres','tipoDoc','numDoc', 'edad', 'estadoCivil','ipress','fecha'];

  constructor(private fb                      : FormBuilder, 
              private dialog                  : Dialog,
              private notificationService     : NotificationService,
              private datosService            : DatosGeneralesService,
              private afiliacionesService     : AfiliacionesSolicitudesService,) { }

  ngOnInit(): void {
    this.onLoadData()
    this.datosService.getTipoParametros('ESTADO_FICHA_ADMISION').subscribe((data)=>{
      this.opciones = data.data;
    });
  }

  onLoadData(){
    this.afiliacionesService.getListaContacto(this.getContactos()).subscribe((data)=>{
      if (data.code == 0) {
      this.dataSource = data.data.list;
      this.pageNum = data.data.pageNum;
      this.pageSize = data.data.pageSize;
      this.total = data.data.total;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }
  
  getDataFecha(value: any){
    this.formBuscar.get('frmSearchDate')?.setValue(value);
    this.onLoadData();
  }

  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.onLoadData();
  }

  getContactos(): listaConstactosRequest{
    var fecInicio: any;
    var fecFin: any;
    var idUnidOpe = JSON.parse(localStorage.getItem("UnidElegida")!);

    if (this.formBuscar.value.frmSearchDate == '') {
      fecInicio = `${new Date().getFullYear()}-1-1`;
      fecFin = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
    }
    else{
      var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
      var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
      fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
      fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;
    }
    console.log(this.formBuscar.get('frmSearchEstado')?.value)
    return {
      idUnidOpe: idUnidOpe.idUnidOperativa,
      texto: this.formBuscar.controls['frmSearch'].value,
      fecInicio: fecInicio,
      fecFin: fecFin,
      pageNum: this.pageNum.toString(),
      pageSize: this.pageSize.toString(),
      estado: this.formBuscar.get('frmSearchEstado')?.value
    }
  }

  getPayload(): RequestListaSAfiliadosContacto{
    var fecInicio: any;
    var fecFin: any;

    if (this.formBuscar.value.frmSearchDate == '') {
      fecInicio = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()-1}`;
      fecFin = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`;
    }
    else{
      fecInicio = this.formBuscar.value.frmSearchDate.split(' - ')[0];
      fecFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
    }

    return {
      estado: 1,
      fechaInicio: fecInicio,
      fechaFin: fecFin,
      buscar: this.formBuscar.controls['frmSearch'].value
    }
  }


  firstDisplayValue(value: any){
    this.formBuscar.get('frmSearchEstado')?.setValue(value);
    this.onLoadData();
  }
}
