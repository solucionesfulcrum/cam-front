import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ReporteUsuario } from '@models/reporte-usuario/reporte-usuario';
import { NotificationService } from '@services/notification.service';
import { ReporteUsuarioService } from 'src/app/data/services/reportes/reporte-usuario.service';

@Component({
  selector: 'app-reportes-excel',
  templateUrl: './reportes-excel.component.html',
  styleUrls: ['./reportes-excel.component.scss']
})
export class ReportesExcelComponent implements OnInit {
  formBuscar: FormGroup;
  dataSource: ReporteUsuario[] = [];
  columns: string[] = ['nombreReporte', 'idRecurso', 'fechReg', 'fechFin', 'estado', 'acciones'];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20];
  total = 0;
  loadingData: boolean = false;

  faSpinner = faSpinner;

  constructor(
    private fb: FormBuilder,
    private reporteUsuarioService: ReporteUsuarioService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.formBuscar = this.fb.group({
      frmSearch: new FormControl(''),
      frmSearchDate: new FormControl(''),
      frmSearchEstado: new FormControl()
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loadingData = true;
    const idUsuario = JSON.parse(localStorage.getItem('camUser')!).idUsuario;
    this.reporteUsuarioService.listarReportesUsuario(idUsuario).subscribe({
      next: (data: any) => {
        this.loadingData = false;
        if (data.code === 0) {
          this.dataSource = data.data;
          this.total = data.data.length;
        } else {
          this.notificationService.warning(data.message);
        }
      },
      error: (err: any) => {
        this.loadingData = false;
        this.notificationService.error('Error al cargar los reportes de usuario');
        console.error(err);
      }
    });
  }

  descargarReporte(idReporteUsuario: number, row: any): void {
    row.loading = true; // Habilitar el estado de carga del botón
  
    this.reporteUsuarioService.descargarReporte(idReporteUsuario).subscribe({
      next: (data) => {
        this.notificationService.success('Se está descargando el reporte');
        const blob: Blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = 'Reporte_Usuario.xlsx';
        anchor.href = url;
        anchor.click();
        window.URL.revokeObjectURL(url);
        row.loading = false; // Desactivar el estado de carga
      },
      error: (err) => {
        this.notificationService.error('Error al descargar el reporte');
        console.error(err);
        row.loading = false; // Desactivar el estado de carga
      }
    });
  }
  

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.loadData();
  }
}
