import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AdmisionCitasService } from '@services/admision/admision-citas.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { NotificationService } from '@services/notification.service';
import { Parametro } from '@shared/components/opciones-busqueda/parametros-busqueda.model';

@Component({
  selector: 'esp-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss']
})
export class CitasComponent{

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = {} as MatPaginator;
  columns: string[] = ['numHistClinica','nombre', 'tipoDoc', 'numDoc', 'proceso','actividades','citadas','status'];

  dataSource: any[] = [];
  searchInput: string = '';

  tipoProceso: Parametro[] = [];
  tipoProcesoSelected = null;

  tipoProcesoEstado: Parametro[] = [];
  procesoEstadoSelected = null;

  idUnidadOperativaUser = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;

  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:number[] = [5,10,20];
  total = 0;

  constructor(private fb                        : FormBuilder,
              private datosService              : DatosGeneralesService,
              private notificationService       : NotificationService,
              private _admisionCitasService     : AdmisionCitasService){
  }

  
  ngOnInit(): void {
    // this.dataSource = this._admisionCitasService.getAdmisionCitasListado()
    this.paginator._intl.itemsPerPageLabel="Registros por página";
    this.getFiltros();
    this.onLoad();
  }

  onLoad(){
    this._admisionCitasService.listarCitasBandeja({
      texto : this.searchInput,
      proceso : this.tipoProcesoSelected!,
      estado : this.procesoEstadoSelected!,
      unidOperativaId: this.idUnidadOperativaUser,
      pageNum : this.pageNum,
      pageSize: this.pageSize
    }).subscribe((data)=>{
      if (data.code == 0) {
        const dataObj = Object(data.data);
        // console.log(dataObj)
        this.dataSource = dataObj.list;
        this.pageNum = dataObj.pageNum;
        this.pageSize = dataObj.pageSize;
        this.total = dataObj.total;
      }
      else{
        this.notificationService.warning(data.message)
      }
    })
  }

  getFiltros(){
    this.datosService.getTipoParametros('CITA_PROCESO_ESTADO').subscribe((data)=>{
      if (data.code == 0) {
        this.tipoProcesoEstado = data.data;
      }
      else{
        this.notificationService.warning(data.message)
      }
    })

    this.datosService.getTiposProcesos().subscribe((data: any)=>{
      if (data.code == 0) {
        let parametros: Parametro[] = [];
        data.data.map((x: any) =>{
          let param: Parametro = Object();
          param.idParametros = x.procesoId;
          param.valor1 = x.procesoId;
          param.nombre = x.nombre;
          param.fechaRegistro = x.fechReg;
          param.activo = true;
          parametros.push(param)
        })
        this.tipoProceso = parametros;
      }
      else{
        this.notificationService.warning(data.message)
      }
    })
  }
  
  handlePageEvent(event: PageEvent) {
    
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.onLoad();
  }
  // ngAfterViewInit(): void{
  //   document.getElementById('search')?.setAttribute('size',(document.getElementById('search')?.getAttribute('placeholder')?.length)?.toString()!);
  //   console.log(document.getElementById('search')?.getAttribute('placeholder')?.length);
  // }
}

