import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DetalleParticipanteComponent } from '../modals/detalle-participante/detalle-participante.component';

const ELEMENT = [
  {nombres: 'ROXANA ESTRADA ARIAS', documento: '23835688', edad: '90', estado_civil: 'Casada', distrito: 'QUILLABAMBA', telefono: '949085725'},
  {nombres: 'JUAN ALBERTO DORADO RIVERA', documento: '23835688', edad: '90', estado_civil: 'Soltero', distrito: 'SICUANI', telefono: '949085725'},
  {nombres: 'JOSE ALBERTO SILCA RIVERA', documento: '23835688', edad: '90', estado_civil: 'Casado', distrito: 'METROPOLITANO', telefono: '949085725'},
  {nombres: 'MARISABEL CASOS BONETT', documento: '23835688', edad: '90', estado_civil: 'Viuda', distrito: 'CALCA', telefono: '949085725'},
  {nombres: 'ANA PURIFICACIÓN ZUÑIGA DE GALVEZ', documento: '23835688', edad: '90', estado_civil: 'Casada', distrito: 'SICUANI', telefono: '949085725'},
  {nombres: 'LIZ PURIFICACIÓN ZUÑIGA DE GALVEZ', documento: '23835688', edad: '90', estado_civil: 'Casada', distrito: 'URCOS', telefono: '949085725'},
  {nombres: 'MARIANA SILVA ZUÑIGA DE GALVEZ', documento: '23835688', edad: '90', estado_civil: 'Casada', distrito: 'MIRAFLORES', telefono: '949085725'},
  {nombres: 'FRIDA AIDA PAREDES RUIZ', documento: '23835688', edad: '90', estado_civil: 'Soltera', distrito: 'SICUANI', telefono: '949085725'},
  {nombres: 'MARILUZ CORONADO CALVO', documento: '23835688', edad: '90', estado_civil: 'Casada', distrito: 'MIRAFLORES', telefono: '949085725'},
  {nombres: 'ANA PURIFICACIÓN ZUÑIGA DE GALVEZ', documento: '23835688', edad: '90', estado_civil: 'Casada', distrito: 'SICUANI', telefono: '949085725'},
]

@Component({
  selector: 'app-ver-participantes',
  templateUrl: './ver-participantes.component.html',
  styleUrls: ['./ver-participantes.component.css']
})
export class VerParticipantesComponent implements OnInit {
  dataSource = new MatTableDataSource<any>(ELEMENT);
  displayedColumns: string[] = ['nombres', 'documento', 'edad', 'estado_civil', 'distrito', 'telefono'];
  demo1TabIndex = 3;
  constructor(
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  filtrarTabla(event: any): void {

  }

  registrarParticipante(): void {

  }

  verDetallesParticipante(element: any): void {
    const dialog = this.dialog.open(DetalleParticipanteComponent, {
      data: {title: 'Detalle del participante', element},
      disableClose: true,
      width: '500px'
    })
  }

  volverEventos(): void {
    this.router.navigate(['/planificacion'])
  }
}
