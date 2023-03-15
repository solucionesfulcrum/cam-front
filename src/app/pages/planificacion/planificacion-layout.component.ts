import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

const PROFESIONAL = [
  {
    nombres: 'ROXANA ESTRADA ARIAS',
    documento: '23835688',
    fecha: '31/08/2022',
    codigo: '3145000',
    rol: 'Tramitador',
    telefono: '949085725',
  },
];
const CIRAM = [
  {
    codigo: '23835688',
    nombres: 'CIRAM DE LA CRUZ',
    fecha_registro: '31/08/2022',
    distrito: 'Cusco',
    direccion: 'Jr. pepa luna 150',
    nro_contacto: '949085725',
  },
];
const TALLERISTA = [
  {
    nombres: 'ROXANA ESTRADA ARIAS',
    documento: '23835688',
    estado: 'Activo',
    fecha: '31/08/2022',
    regimen: 'Tercero',
    telefono: '949085725',
  },
];

@Component({
  selector: 'app-planificacion-layout',
  templateUrl: './planificacion-layout.component.html',
  styleUrls: ['./planificacion-layout.component.css'],
})
export class PlanificacionLayoutComponent implements OnInit {
  formProfesional = this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });
  formCirams = this.fb.group({});
  formTallerista = this.fb.group({});
  formEventos = this.fb.group({});
  dataSourceProfesional = new MatTableDataSource<any>(PROFESIONAL);
  displayedColumnsProfesional: string[] = [
    'nombre',
    'documento',
    'fecha_ingreso',
    'codigo_planilla',
    'rol',
    'telefono',
  ];
  dataSourceCirams = new MatTableDataSource<any>(CIRAM);
  displayedColumnsCirams: string[] = [
    'codigo',
    'nombres',
    'fecha_registro',
    'distrito',
    'direccion',
    'nro_contacto',
  ];
  dataSourceTallerista = new MatTableDataSource<any>(TALLERISTA);
  displayedColumnsTallerista: string[] = [
    'nombre',
    'documento',
    'estado',
    'fecha_ingreso',
    'regimen',
    'telefono',
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  @ViewChild('paginatorProfesional') paginatorProfesional: MatPaginator;
  @ViewChild('paginatorCirams') paginatorCirams: MatPaginator;
  @ViewChild('paginatorTallerista') paginatorTallerista: MatPaginator;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
    this.dataSourceProfesional.paginator = this.paginatorProfesional;
    this.dataSourceCirams.paginator = this.paginatorCirams;
    this.dataSourceTallerista.paginator = this.paginatorTallerista;
  }

  filtrarFechas(): void {}

  filtrarTablaProfesional(event: any): void {}

  filtrarTablaCirams(event: any): void {}

  filtrarTablaTallerista(event: any): void {}

  filtrarTablaEventos(event: any): void {}

  verDetallesProfesional(): void {
    this.router.navigate(['/planificacion/edit-profesional']);
  }

  verDetallesCirams(): void {
    this.router.navigate(['/planificacion/edit-ciram']);
  }

  verDetallesTallerista(): void {
    this.router.navigate(['/planificacion/edit-tallerista']);
  }

  irNuevoProfesional(): void {
    this.router.navigate(['/planificacion/nuevo-profesional']);
  }

  irNuevoCirams(): void {
    this.router.navigate(['/planificacion/nuevo-ciram']);
  }

  irNuevoTallerista(): void {
    this.router.navigate(['/planificacion/nuevo-tallerista']);
  }

  verParticipantes(): void {
    this.router.navigate(['planificacion/evento/ver-participantes']);
  }
}
