import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { RequestListaSAfiliadosContacto,listaConstactosRequest } from '@models/afiliados/ficha-solicitud.model';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { DialogNewAseguradoComponent } from './sub-components/dialog/dialog-new-asegurado/dialog-new-asegurado.component';

@Component({
  selector: 'app-contactos-afiliados',
  templateUrl: './contactos-afiliados.component.html',
  styleUrls: ['./contactos-afiliados.component.css']
})
export class ContactosAfiliadosComponent implements OnInit {
  opcionesBotones: FormatoBoton[] = [
    {texto: '+ Nuevo', colorBtn:'mezclado'},
  ];
  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
  });
  dataSource: any[] = [];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;
  columns: string[] = ['marcar','nombres','tipoDoc','numDoc', 'edad', 'estadoCivil','ipress','fecha'];

  constructor(private fb                      : FormBuilder, 
              private dialog                  : Dialog,
              private afiliacionesService     : AfiliacionesSolicitudesService,) { }

  ngOnInit(): void {
    this.onLoadData()
  }

  onLoadData(){
    /*this.dataSource = [
      {nombres: 'ROXANA ESTRADA ARIAS', tipoDoc: 1, numDoc: '23835688', fecNac: '16/03/1968', estCivil: 'SOLTERA', ipress: 'EUNICE ELIZABETH', estado: 1}
    ]*/
    this.total = this.dataSource.length;
    this.afiliacionesService.getListaContacto(this.getContactos()).subscribe((data)=>{
    this.dataSource = data.data.list;
    this.total = this.dataSource.length;
    console.log("resultado data",data.data.list)
    })
  }
  
  getDataFecha(value: any){
    this.formBuscar.get('frmSearchDate')?.setValue(value);
    this.onLoadData();
  }

  handlePageEvent(event: PageEvent) {
    // console.log(this.pageSizeOptions);
    console.log(event)
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.onLoadData();
  }

  getContactos(): listaConstactosRequest{
    var fecInicio: any;
    var fecFin: any;
    var idUnidOpe = localStorage.getItem("UnidElegida");

    if (this.formBuscar.value.frmSearchDate == '') {
      fecInicio = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()-1}`;
      fecFin = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`;
    }
    else{
      fecInicio = this.formBuscar.value.frmSearchDate.split(' - ')[0];
      fecFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
    }

    return {
      idUnidOpe: "33",
      apellidos: "",
      nombres: "",
      tipoDocIdent: "",
      numDocIdent: "",
      fecInicio: "2021-08-17",
      fecFin: "2024-11-17",
      pageNum: "1",
      pageSize: "10",
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

  getEdad(fecha: string): number{
    /*let fecNac = new Date(parseInt(fecha.split('/')[2]), parseInt(fecha.split('/')[1]) - 1, parseInt(fecha.split('/')[0]));
    var timeDiff = Math.abs(Date.now() - fecNac.getTime());
    let edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);

    return edadPersona*/
    return 30
  }

  nuevoAsegurado(){
    const dialogRef = this.dialog.open(DialogNewAseguradoComponent,{
      minWidth:'800px',
      maxWidth:'50%',
      data:{}
    })
    dialogRef.closed.subscribe(out =>{
      // console.log(out)
    })
  }
}
