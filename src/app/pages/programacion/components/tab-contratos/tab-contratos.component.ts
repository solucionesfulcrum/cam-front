import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ProgramacionRequestListContratos } from '@models/programacion/programacion-contratos/programacion-contrato-lista.model';
import { NotificationService } from '@services/notification.service';
import { Parametro } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ProgramacionContratosService } from 'src/app/data/services/programacion/programacion-contratos.service';

@Component({
  selector: 'esp-tab-contratos',
  templateUrl: './tab-contratos.component.html',
  styleUrls: ['./tab-contratos.component.scss']
})
export class TabContratosComponent {
  opciones: Parametro[] = [];

  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
  });

  dataSource: any[] = [];
  columns: string[] = ['marcar','numOc','fechaRegistro','tallerista', 'tipoDoc', 'numDoc','desde','hasta','estado'];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;

  loadingData : boolean = false;
  
  constructor(private fb                      : FormBuilder,
              private programacionService     : ProgramacionContratosService,
              private datosService             : DatosGeneralesService,
              private notificationService     : NotificationService
  ) { }

  ngOnInit(){
    this.datosService.getTipoParametros('ESTADO_PROGRAMACION').subscribe((data)=>{
      if (data.code == 0) {
        this.opciones = data.data;
      }
      else{
        this.notificationService.warning(data.message);
      }
    });
  }

  loadData(){

    setTimeout(() => {
      this.loadingData = true;
      this.programacionService.listContratosProgramacion(this.getPayloadList()).subscribe((data)=>{
        this.loadingData = false;
        if (data.code == 0) {
          console.log(data.data.list)
          this.dataSource = data.data.list;
          this.pageNum = data.data.pageNum;
          this.total = data.data.total;
        }
        else {
          this.notificationService.warning(data.message);
        }
      })
    });
    
  }

  getPayloadList(): ProgramacionRequestListContratos{
    var fecInicio: any;
    var fecFin: any;
    var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
    var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
    fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
    fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;

    return {
      idUnidOpe: JSON.parse(localStorage.getItem("UnidElegida")!).idUnidOperativa,
      texto: this.formBuscar.controls['frmSearch'].value,
      fecInicio: fecInicio,
      fecFin: fecFin,
      estado: this.formBuscar.get('frmSearchEstado')?.value,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }
  }
  
  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.loadData();
  }
}
