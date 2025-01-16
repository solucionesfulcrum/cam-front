import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ReporteUsuario, ReportesGeneradosRequest, SubReporteUsuario } from '@models/reporte-usuario/reporte-usuario';
import { NotificationService } from '@services/notification.service';
import { ReporteUsuarioService } from 'src/app/data/services/reportes/reporte-usuario.service';

@Component({
  selector: 'esp-detalle-reporte',
  templateUrl: './detalle-reporte.component.html',
  styleUrls: ['./detalle-reporte.component.scss']
})
export class DetalleReporteComponent implements OnInit {
  formBuscar: FormGroup;
  dataSource: SubReporteUsuario[] = [];
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
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: ReporteUsuario, // Aquí se usa @Inject correctamente
    private _dialogRef: MatDialogRef<any>

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
    
    setTimeout(() => {
      this.loadingData = true;
      this.reporteUsuarioService.listarSubReportes(this.data.idReporteUsuario).subscribe({
        next: (data) => {
          this.loadingData = false;
          if (data.code === 0) {
            this.dataSource = data.data;
            this.total = data.data.length;
            this.pageIndex = 1;
          } else {
            this.notificationService.warning(data.message);
          }
        },
        error: (err) => {
          this.loadingData = false;
          this.notificationService.error('Error al cargar los reportes de usuario');
          console.error(err);
        }
      });
    })
   
  }

  descargarReporte(idReporteUsuarioAgrupado: number, row: any): void {
    row.loading = true; // Habilitar el estado de carga del botón

    this.reporteUsuarioService.descargarSubReporte(idReporteUsuarioAgrupado).subscribe({
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

  getPayloadList(): ReportesGeneradosRequest{
    var fecInicio: any;
    var fecFin: any;
  
    var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
    var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
  
   /* const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // Día con dos dígitos
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos
    const year = today.getFullYear();
    var fechaSinFormatFin = `${day}/${month}/${year}`;
    var fechaSinFormatInit = '01/01/2023';*/
  
     // var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
    //var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
    
    fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
    fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;
  
    return {
      idUsuario: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario,
      texto: this.formBuscar.controls['frmSearch'].value,
      fecInicio: fecInicio,
      fecFin: fecFin,
      estado: this.formBuscar.get('frmSearchEstado')?.value,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }
  }
  

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.loadData();
  }
}


