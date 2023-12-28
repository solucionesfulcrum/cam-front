import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-contactos-talleristas',
  templateUrl: './contactos-talleristas.component.html',
  styleUrls: ['./contactos-talleristas.component.css']
})
export class ContactosTalleristasComponent implements OnInit {

  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchEstado:new FormControl(),
    frmSearchAccion:new FormControl(),
  });
  columns: string[] = ['marcar','nombres','tipoDoc','numDoc', 'telefono', 'correo','perfil'];
  
  dataSource: any[] = [];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;
  
  constructor(private fb: FormBuilder, ) { }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(){
    this.dataSource = [
      {nombre: 'ROXANA ESTRADA ARIAS', tipoDoc: 1, numDoc: '28277073',telefono: '949451724', correo: 'tim.jennings@example.com', perfil: 'Trabajador Social'},
      {nombre: 'FRIDA AIDA PAREDES RUIZ' , tipoDoc: 1, numDoc: '40293555',telefono: '949451724', correo: 'felicia.reid@example.com', perfil: 'Trabajador Social'},
      {nombre: 'ANGELA KIARA MENDOZA MARCATINCO', tipoDoc: 1, numDoc: '91599999',telefono: '949451724', correo: 'jessica.hanson@example.com', perfil: 'Psicologo'},
      {nombre: 'MIGUEL FREDY TENORIO SALVATIERRA', tipoDoc: 1, numDoc: '43635826',telefono: '949451724', correo: 'nevaeh.simmons@example.com', perfil: 'Medico'},
      {nombre: 'Juan Alberto Dorado Rivera', tipoDoc: 1, numDoc: '23835688',telefono: '949451724', correo: 'kenzi.lawson@example.com', perfil: 'Admisionista'},
      {nombre: 'ANA PURIFICACION ZUÑIGA DE GALVEZ', tipoDoc: 1, numDoc: '23835688',telefono: '949451724', correo: 'michelle.rivera@example.com', perfil: 'Medico'},
      {nombre: 'ANA PURIFICACION ZUÑIGA DE GALVEZ', tipoDoc: 1, numDoc: '23835688',telefono: '949451724', correo: 'jackson.graham@example.com', perfil: 'Trabajador Social'},
      {nombre: 'FRIDA AIDA PAREDES RUIZ', tipoDoc: 1, numDoc: '23811054',telefono: '949451724', correo: 'michael.mitc@example.com', perfil: 'Psicologo'},
      {nombre: 'MARILUZ CORONADO CALVO', tipoDoc: 1, numDoc: '23886393',telefono: '949451724', correo: 'debra.holt@example.com', perfil: 'Admisionista'},
      {nombre: 'MARILUZ CORONADO CALVO', tipoDoc: 1, numDoc: '23855637',telefono: '949451724', correo: 'tanya.hill@example.com', perfil: 'Medico'}
    ]
  }
  
  handlePageEvent(event: PageEvent) {
    // console.log(this.pageSizeOptions);
    console.log(event)
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.onLoadData();
  }
}
