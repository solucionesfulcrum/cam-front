import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RequestListaSAfiliadosContacto } from '@models/afiliados/ficha-solicitud.model';
import { AuthService } from '@services/auth.service';
import { NotificationService } from '@services/notification.service';
import { ChartComponent } from 'ng-apexcharts';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { ChartOptions } from '../dashboard-afiliados/dashboard-afiliados.component';
import { ReportesService } from 'src/app/data/services/reportes/reportes.service';
import { MatTableDataSource } from '@angular/material/table';
import { AsistenciasTalleres, PayloadReportes } from '@models/dashboard/dashboard.model';

@Component({
  selector: 'esp-dashboard-asistencias',
  templateUrl: './dashboard-asistencias.component.html',
  styleUrls: ['./dashboard-asistencias.component.scss']
})
export class DashboardAsistenciasComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;
  totalAfiliados: number = 0;
  faSpinner = faSpinner;
  respuestaServicio=1000;
  totalAfiliadosActivos: number = 0;
  dataServicio: any;
  rol = JSON.parse(localStorage.getItem('UnidElegida')!).rol;
  idUnidadOperativaUser = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;

  formBuscar: FormGroup = this.fb.group({
    frmSearch: new FormControl(""),
    frmSearchDate: new FormControl(""),
    frmSearchEstado: new FormControl(),
  });
  dataSource: MatTableDataSource<AsistenciasTalleres> = new MatTableDataSource<AsistenciasTalleres>();

  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20];
  total = 0;
  columns: string[] = ['servicios', 'asistencias', 'porcentaje'];

  loading : boolean = true;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private afiliacionesService: AfiliacionesSolicitudesService,
    private notificationService: NotificationService,
    private reportesService: ReportesService
  ) {

  }

  ngOnInit(): void {
    this.reportesService.getDataAsistenciaTalleres(this.getPayload()).subscribe(data => {
      this.loading = false;
      this.dataSource.data = data.data
    })
  }

  getDataReporte(): void {
    
  }

  getPayload() : PayloadReportes{
    return {
      "idUnidadOperativa": 132,
      "fecInicio": "2024-03-01",
      "fecFin": "2025-04-31"
    }
  }

  onLoadData() {
   
  }

  getDataFecha(value: any) {
    this.formBuscar.get('frmSearchDate')?.setValue(value);
    // console.log("fecha?",value)
    this.onLoadData();
  }
}
