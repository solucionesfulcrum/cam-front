import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ReportesGeneradosRequest, ReporteUsuario, SubReporteUsuario } from '@models/reporte-usuario/reporte-usuario';
import { NotificationService } from '@services/notification.service';
import { ReporteUsuarioService } from 'src/app/data/services/reportes/reporte-usuario.service';
import { DetalleReporteComponent } from '../dialogs/detalle-reporte/detalle-reporte.component';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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
    private router: Router,
    private matDialog: MatDialog
  ) {
    this.formBuscar = this.fb.group({
      frmSearch: new FormControl(''),
      frmSearchDate: new FormControl(''),
      frmSearchEstado: new FormControl()
    });
  }

  ngOnInit(): void {
    //this.loadData();
  }

  loadData(): void {
    
    setTimeout(() => {
      this.loadingData = true;
      this.reporteUsuarioService.listarReportesUsuarioDt(this.getPayloadList()).subscribe({
        next: (data) => {
          this.loadingData = false;
          if (data.code === 2) {
            this.dataSource = data.data.list;
            this.total = data.data.total;
            this.pageIndex = data.data.pageNum - 1;
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

  descargarReporte(idReporteUsuario: number, row: any): void {
    row.loading = true; // Habilitar el estado de carga del botón

    if(row.esAgrupado){
      this.procesarExcelFront(row, idReporteUsuario);
      
    /*this.reporteUsuarioService.descargarExcelCombinado(idReporteUsuario).subscribe({
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
    });*/
    }
    else{
      
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

  verDetalle(row: any){
    this.matDialog.open(DetalleReporteComponent, {
      width: "1400px",
      data: row
    })
  }
  

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.loadData();
  }

  //PROCESAMIENTO DEL LADO DEL FRONT:
  procesarExcelFront(row : any, idReporteUsuario: number){
      this.reporteUsuarioService.listarSubReportes(idReporteUsuario).subscribe({
        next: (data) => {
          this.loadingData = false;
          if (data.code === 0) {
            this.combinarArchivos(row, data.data);
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
  }

  private combinarArchivos(row: any, reportes: SubReporteUsuario[]): void {
    const workbook = new ExcelJS.Workbook();
    const combinedSheet = workbook.addWorksheet('Reporte Combinado');
    let isHeaderCopied = false;
  
    const promises = reportes.map((reporte) =>
      this.reporteUsuarioService.descargarSubReporte(reporte.idReporteUsuarioAgrupado).toPromise()
    );
  
    Promise.all(promises)
      .then((blobs) => {
        blobs.forEach((blob, index) => {
          const tempWorkbook = new ExcelJS.Workbook();
  
          tempWorkbook.xlsx.load(blob).then(() => {
            const tempSheet = tempWorkbook.getWorksheet(1); // Obtener la primera hoja
            tempSheet!.eachRow((excelRow, rowIndex) => {
              const values = excelRow.values as any[]; // Valores de la fila (incluyendo celdas vacías)
  
              // Verificar si la fila contiene al menos una celda no vacía
              const hasNonEmptyCell = values.some((cell) => cell !== null && cell !== undefined && cell !== '');
  
              if (rowIndex === 1 && !isHeaderCopied) {
                // Copiar cabecera con estilos
                const headerRow = combinedSheet.addRow(values);
                this.applyHeaderStyle(headerRow, combinedSheet); // Aplicar estilo y ajustar ancho de columnas
                isHeaderCopied = true;
              } else if (rowIndex > 1 && hasNonEmptyCell) {
                // Agregar filas con datos (aunque tengan celdas vacías)
                combinedSheet.addRow(values);
              }
            });
  
            // Guardar el archivo combinado una vez completado
            if (index === blobs.length - 1) {
              workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'Reporte_Combinado.xlsx');
              });
            }
          });
        });
      })
      .catch((err) => console.error('Error al descargar subreportes:', err));
  }
  
  private applyHeaderStyle(row: ExcelJS.Row, worksheet: ExcelJS.Worksheet): void {
    row.eachCell((cell, colNumber) => {
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' }, // Fuente blanca
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0066CC' }, // Fondo azul
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
  
      // Ajustar el ancho de las columnas dinámicamente
      const cellValue = cell.value ? cell.value.toString() : '';
      const currentWidth = worksheet.getColumn(colNumber).width || 15;
      worksheet.getColumn(colNumber).width = Math.max(currentWidth, cellValue.length + 10);
    });
  }
  
  
  
}
