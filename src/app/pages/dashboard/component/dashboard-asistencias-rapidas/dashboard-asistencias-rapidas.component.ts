import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NotificationService } from '@services/notification.service';
import { ChartOptions } from '../dashboard-afiliados/dashboard-afiliados.component';
import { ChartComponent } from 'ng-apexcharts';
import { RequestDashboardAsistenciaExportarTxt } from '@models/dashboard/dashboard.-talleresmodel';
import { DashboardService } from 'src/app/data/services/dashboard/dashboard.service';
import { Parametro } from '@models/parametros-busqueda.model';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { AppVariables } from 'src/app/data/constants/app-variables.constant';
import { ParamMenu } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import * as saveAs from 'file-saver';

@Component({
  selector: 'esp-dashboard-asistencias-rapidas',
  templateUrl: './dashboard-asistencias-rapidas.component.html',
  styleUrls: ['./dashboard-asistencias-rapidas.component.scss']
})
export class DashboardAsistenciasRapidasComponent {
  @ViewChild("chart") chart!: ChartComponent;
  dataUnidadSeleccionada = JSON.parse(localStorage.getItem("UnidElegida")!);
  public chartOptions!: Partial<ChartOptions> | any;
  formBuscar: FormGroup = this.fb.group({
    frmSearchDate: new FormControl(""),
    frmSearchEstado: new FormControl(),
    frmSearchCam: new FormControl(""),
  });
  selectedTotal: number = null!;
  opcionesFiltroTotal: any[] = [
    {value: null, tituloCard: 'Total de Taller/Actividad', rutaIcon: 'icon-dashboard-taller-actividad', totalCalculado: 0},
    {value: 1, tituloCard: 'Taller/Actividad Finalizados', rutaIcon: 'icon-dashboard-taller-finalizados', totalCalculado: 0},
    {value: 0, tituloCard: 'Taller/Actividad Abiertos', rutaIcon: 'icon-dashboard-taller-abiertos', totalCalculado: 0},
  ];
  dataAcciones: ParamMenu[] = [
    {texto: 'Descargar Registros', svgDir: 'assets/svg/icons-tipos-archivos/icon-file-text.svg'}
  ];
  opciones_cam: Parametro[] = [];
  validEsCoordinador: boolean = false;
  waitDownload: boolean = false;

  dataCargada = false;
  dataObtenida = false;

  constructor(private fb                    : FormBuilder,
              private notificationService   : NotificationService,
              private datosService          : DatosGeneralesService,
              private dashboardService      : DashboardService,){
    this.chartOptions = {
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
        curve: "smooth"
      },

      title: {
        align: "left"
      },
      subtitle: {
        text: "",
        align: "left"
      },
      xaxis: {
        type: "datetime",
        labels: {
          formatter:  (value: number) => {
            const date = new Date(value);
            const day = date.getDate();
            const month = this.obtenerNombreMes(date.getMonth());
            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
          },
        },
      },
      legend: {
        horizontalAlign: "left"
      }
    };
  }

  ngOnInit(): void {
    console.log(this.dataUnidadSeleccionada);
    if (AppVariables.ID_COORDINADOR_RED == this.dataUnidadSeleccionada.idRol) {
      this.validEsCoordinador = true;
      this.datosService.getCams(this.dataUnidadSeleccionada.idUnidOperativa).subscribe((data)=>{
        this.opciones_cam = data.data.map((e : any)=>{ //No había más solución
          return {...e, idParametros: e.codigo} as Parametro
        });
        console.log(data.data)
      });
    }
  }

  onLoadData(){
    this.dataCargada = false;
    this.dashboardService.obtenerDatosGraficoAsistenciaRapida(this.getPayload()).then((data)=>{
      if (data.code == 0) {
        this.dataObtenida = true;
        this.opcionesFiltroTotal[0].totalCalculado = data.data.sumaTotal;
        this.opcionesFiltroTotal[1].totalCalculado = data.data.sumaFinalizadas;
        this.opcionesFiltroTotal[2].totalCalculado = data.data.sumaAbiertos;

        this.chartOptions.series = [
          {
            name: "Talleres",
            data: data.data.contAsegurados
          }
        ];
        this.chartOptions.labels = data.data.fecha;

        let totalCalculados = 0;
        data.data.contAsegurados.forEach((x: any)=> totalCalculados += x);
        if(totalCalculados >= 4){
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

        console.log(data.data)
      }
      else{
        this.notificationService.warning(data.message);
      }
      this.dataCargada = true;
    })

  }

  selectSegmento(value: number){
    this.selectedTotal = value;
    this.onLoadData();
  }

  getDataFecha(value: any) {
    this.formBuscar.get('frmSearchDate')?.setValue(value);
    // //console.log("fecha?",value)
    this.onLoadData();
  }

  firstDisplayValue(value: any){
    value = value == "null" ? "" : value;
    this.formBuscar.get('frmSearchCam')?.setValue(value);
    this.onLoadData();
  }

  getPayload(): RequestDashboardAsistenciaExportarTxt{
    const fechaIicioComponent = this.formBuscar.get('frmSearchDate')?.value.split("-")[0].trim();
    const fechaInicio = fechaIicioComponent.split("/");
    const fechaFormateadaInicio = `${fechaInicio[2]}-${fechaInicio[1]}-${fechaInicio[0]}`;

    const fechaFinComponent = this.formBuscar.get('frmSearchDate')?.value.split("-")[1].trim();
    const fechaFin = fechaFinComponent.split("/");
    const fechaFormateadaFin= `${fechaFin[2]}-${fechaFin[1]}-${fechaFin[0]}`;
    
    let codCam = (AppVariables.ID_COORDINADOR_RED == this.dataUnidadSeleccionada.idRol ? this.formBuscar.get('frmSearchCam')!.value : this.dataUnidadSeleccionada.codigo);

    return {
      codigoRed: AppVariables.ID_COORDINADOR_RED == this.dataUnidadSeleccionada.idRol ? this.dataUnidadSeleccionada.codigo : '',
      estado: this.selectedTotal,
      fecInicio: fechaFormateadaInicio,
      fecFin: fechaFormateadaFin,
      codigoCam: codCam,
    }
  }
  
  obtenerNombreMes(mes: number): string {
    const meses = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];
    return meses[mes];
  }

  procedeDescargaReporte(){
    this.waitDownload = true;
    this.dashboardService.obtenerReporteTextPlanoAsistenciaRapida(this.getPayload()).subscribe((data)=>{

      const csvData = this.convertToCsv(data, '|');
      const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'Reporte Asistencias Rápidas.csv');
      this.waitDownload = false;
    })
  }

  private convertToCsv(data: string, delimiter: string): string {
    return data.split('\n').map(line => line.replace(new RegExp(`\\${delimiter}`, 'g'), ',')).join('\n');
  }
}
