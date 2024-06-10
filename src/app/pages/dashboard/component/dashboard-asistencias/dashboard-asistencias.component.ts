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
  fechaDesde: string = "";
  fechaHasta: string = "";
  labelFecha: string = "";

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

  totalAsistencia : number = 0;
  cantidadServicioCartera: number = 0;
  cantidadCiram: number = 0;

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
  }

  getDataReporte(): void {
    this.loading = true;
    this.reportesService.getDataAsistenciaTalleres(this.getPayload()).subscribe(data => {
      this.loading = false;
      this.cantidadServicioCartera = data.data.cantidadServicioCartera;
      this.cantidadCiram = data.data.cantidadCiram;
      const sortedArray = data.data.listaCantidadAsistencia.sort((a, b) => b.cantidadAsistencia - a.cantidadAsistencia);
      this.totalAsistencia = sortedArray.reduce((sum, item) => sum + item.cantidadAsistencia, 0);
      this.dataSource.data = sortedArray;
    })
  }

  getPayload() : PayloadReportes{
    return {
      "idUnidadOperativa": (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      "fecInicio": this.fechaDesde,
      "fecFin": this.fechaHasta
    }
  }

  getDataFecha(value: string) {
    const parts = value.split(" - ");
    this.labelFecha = value;

    const desdeSplit = parts[0].split("/");
    const hastaSplit = parts[1].split("/");

    this.fechaDesde= desdeSplit[2] + "-" + desdeSplit[1] + "-" + desdeSplit[0];
    this.fechaHasta= hastaSplit[2] + "-" + hastaSplit[1] + "-" + hastaSplit[0];

    this.getDataReporte();
  }
}
