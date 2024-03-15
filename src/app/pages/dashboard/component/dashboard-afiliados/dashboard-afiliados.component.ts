import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { RequestListaSAfiliadosContacto } from '@models/afiliados/ficha-solicitud.model';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { AuthService } from '@services/auth.service';
import { listardashboardRequest } from '@models/dashboard/dashboard.model'
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";

import { series } from "./data";
import { ArrayType } from '@angular/compiler';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard-afiliados',
  templateUrl: './dashboard-afiliados.component.html',
  styleUrls: ['./dashboard-afiliados.component.scss']
})
export class DashboardAfiliadosComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;
  totalAfiliados: number = 0;
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
    private afiliacionesService: AfiliacionesSolicitudesService
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
      yaxis: {
        opposite: false,
        tickAmount: 4,
        forceNiceScale: false,
        min: 0,
        labels: {
          formatter: function (val: number) {
            return val.toFixed(0); // This will convert the float to a string with no decimal places
          }
        }
      },
      legend: {
        horizontalAlign: "left"
      }
    };
  }

  ngOnInit(): void {
    this.onLoadData()

  }

  onLoadData() {
    //this.afiliacionesService.getListaAfiliados(this.getPayload()).subscribe((data)=>{
    //this.dataSource = data;
    //this.total = this.dataSource.length;
    //console.log(data)
    //}
    //)

    this.authService.listarDashboard({ fecInicio: '2024-03-01', fecFin: '2024-03-31', idUnidadOperativa: this.idUnidadOperativaUser }).subscribe((data) => {
      console.log("algo saldra", data)
      console.log("algo saldra type", typeof data.data.fecha)
      for (let i = 0; i < data.data.contAsegurados.length; i++) {
        this.totalAfiliados += data.data.contAsegurados[i]; // Suma cada elemento al total
      }
      this.chartOptions.series = [
        {
          name: "PACIENTES",
          data: data.data.contAsegurados // Asume que contAsegurados es un arreglo de números
        }
      ];

      this.chartOptions.labels = data.data.fecha;
    })

  }



  getDataFecha(value: any) {
    this.formBuscar.get('frmSearchDate')?.setValue(value);
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
