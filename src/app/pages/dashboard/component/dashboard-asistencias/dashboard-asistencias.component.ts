import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RequestListaSAfiliadosContacto } from '@models/afiliados/ficha-solicitud.model';
import { AuthService } from '@services/auth.service';
import { NotificationService } from '@services/notification.service';
import { ChartComponent } from 'ng-apexcharts';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { ChartOptions } from '../dashboard-afiliados/dashboard-afiliados.component';

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
  idUnidadOperativaUser = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;

  formBuscar: FormGroup = this.fb.group({
    frmSearch: new FormControl(""),
    frmSearchDate: new FormControl(""),
    frmSearchEstado: new FormControl(),
  });
  dataSource: any[] = [];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20];
  total = 0;
  columns: string[] = ['marcar', 'nombres', 'tipoDoc', 'numDoc', 'edad', 'estadoCivil', 'ipress', 'fecha'];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private afiliacionesService: AfiliacionesSolicitudesService,
    private notificationService: NotificationService
  ) {
    this.chartOptions = {
      /*series: [
        {
          name: "PACIENTES",
          data: series.monthDataSeries2.prices
        }
      ],*/
      chart: {
        type: "area",
        height: 350,
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        /*curve: "straight"*/
        curve: "smooth"
      },

      title: {
        text: "Nuevos Asegurados",
        align: "left"
      },
      subtitle: {
        text: "",
        align: "left"
      },
      //labels: series.monthDataSeries2.dates,
      xaxis: {
        type: "datetime",
        /*labels: {
          formatter: function(value: number, timestamp: number) {
            // Use any date library or native JS to format the timestamp as you wish
            // For example, using the native JS Date object to get 'DD' format
            return new Date(timestamp).getDate(); // This will return only the day part of the date
          }
        }*/
      },
      /*yaxis: {
        opposite: false,
        tickAmount: 4,
        forceNiceScale: false,
        min: 0,
        labels: {
          formatter: function (val: number) {
            return val.toFixed(0); // This will convert the float to a string with no decimal places
          }
        }
      },*/
      legend: {
        horizontalAlign: "left"
      }
    };
  }

  ngOnInit(): void {

  }

  onLoadData() {
    const fechaIicioComponent = this.formBuscar.get('frmSearchDate')?.value.split("-")[0].trim();
    const fechaInicio = fechaIicioComponent.split("/");
    const fechaFormateadaInicio = `${fechaInicio[2]}-${fechaInicio[1]}-${fechaInicio[0]}`;

    const fechaFinComponent = this.formBuscar.get('frmSearchDate')?.value.split("-")[1].trim()
    const fechaFin = fechaFinComponent.split("/");
    const fechaFormateadaFin= `${fechaFin[2]}-${fechaFin[1]}-${fechaFin[0]}`;
    
    this.authService.listarDashboard({ fecInicio: fechaFormateadaInicio, fecFin: fechaFormateadaFin, idUnidadOperativa: this.idUnidadOperativaUser }).subscribe((data) => {
      if (data.code == 0) {
        this.respuestaServicio = data.code;
        console.log("data.code", data.code)
        console.log("data.code", typeof(data.code))
        this.totalAfiliados=0;
        for (let i = 0; i < data.data.contAsegurados.length; i++) {
          this.totalAfiliados += data.data.contAsegurados[i]; 
        }
        this.chartOptions.series = [
          {
            name: "PACIENTES",
            data: data.data.contAsegurados
          }
        ];
  
        if(this.totalAfiliados>=4){
        this.chartOptions.yaxis = [
          {
            opposite: false,
            tickAmount: 4,
            forceNiceScale: false,
            min: 0,
            labels: {
              formatter: function (val: number) {
                return val.toFixed(0); 
              }
            }
          }
        ];
        }else{
          this.chartOptions.yaxis = [
            {
              opposite: false,
              tickAmount: 1,
              forceNiceScale: false,
              min: 0,
              labels: {
                formatter: function (val: number) {
                  return val.toFixed(0); 
                }
              }
            }
          ];
        }
  
        this.chartOptions.labels = data.data.fecha;
        
        this.dataServicio = data.data;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })

    this.authService.listarDashboardActivos({ fecInicio: fechaFormateadaInicio, fecFin: fechaFormateadaFin, idUnidadOperativa: this.idUnidadOperativaUser, estado: 14 }).subscribe((data) => {
      this.totalAfiliadosActivos=0;
      for (let i = 0; i < data.data.contAsegurados.length; i++) {
        this.totalAfiliadosActivos += data.data.contAsegurados[i]; 
      }
    })

  }

  getDataFecha(value: any) {
    this.formBuscar.get('frmSearchDate')?.setValue(value);
    // console.log("fecha?",value)
    this.onLoadData();
  }

  getPayload(): RequestListaSAfiliadosContacto {
    var fecInicio: any;
    var fecFin: any;

    if (this.formBuscar.value.frmSearchDate == '') {
      fecInicio = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear() - 1}`;
      fecFin = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
    }
    else {
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
}
