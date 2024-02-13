import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { RequestListaSAfiliadosContacto } from '@models/afiliados/ficha-solicitud.model';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
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
  styleUrls: ['./dashboard-afiliados.component.css']
})
export class DashboardAfiliadosComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;


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
    private fb: FormBuilder,
    private afiliacionesService: AfiliacionesSolicitudesService
  ) {
    this.chartOptions = {
      series: [
        {
          name: "PACIENTES",
          data: series.monthDataSeries2.prices
        }
      ],
      chart: {
        type: "area",
        height: 350,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },

      title: {
        text: "Nuevos Asegurados",
        align: "left"
      },
      subtitle: {
        text: "",
        align: "left"
      },
      labels: series.monthDataSeries1.dates,
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        opposite: false
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
