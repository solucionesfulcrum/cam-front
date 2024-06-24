import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { HorarioAdministracionService } from '@services/horario/horario-administracion.service';
import { NotificationService } from '@services/notification.service';
import { Parametro } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import { AppRoute } from 'src/app/data/constants/app-route.constant';

@Component({
  selector: 'esp-horario-administrar',
  templateUrl: './horario-administrar.component.html',
  styleUrls: ['./horario-administrar.component.scss']
})
export class HorarioAdministrarComponent {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = {} as MatPaginator;

  columns: string[] = ['marcar','mesAnio','fechaCreacion', 'usuarioCreador', 'estado'];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;
  idUnidadOperativaUser = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;
  dataSource: any[] = [];
  
  filtroFecInit!: string;
  filtroFecFin!: string;
  form: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
  });
  
  estadosHorarios: Parametro[] = [];

  constructor( private router               : Router,
               private fb                   : FormBuilder,
               private horarioService       : HorarioAdministracionService,
               private notificationService  : NotificationService,
               private datosService         : DatosGeneralesService,){}
  
  ngOnInit(): void {
    this.datosService.getTipoParametros('HORARIO_ESTADO').subscribe((data)=>{
      this.estadosHorarios = data.data;
    });
    // this.paginator._intl.itemsPerPageLabel="Registros por página";
    this.onLoadData();
  }

  onLoadData(){
    var fecInicio: any;
    var fecFin: any;

    if (this.form.value.frmSearchDate == '') {
      fecInicio = new Date();
      fecInicio.setMonth(fecInicio.getMonth()-24);
      fecInicio = fecInicio.toJSON().split('T')[0];
      fecFin = new Date().toJSON().split('T')[0];
    }
    else{
      fecInicio = this.filtroFecInit;
      fecFin = this.filtroFecFin;
    }

    this.horarioService.getBandejaHorarios({
      texto: this.form.value.frmSearch,
      fecInicio: fecInicio,
      fecFin: fecFin,
      estado: this.form.value.frmSearchEstado,
      unidOperativaId: this.idUnidadOperativaUser,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }).subscribe((data)=>{
      if (data.code == 0) {
        //console.log(data)
        const dataObj = Object(data.data);
        // //console.log(data)
        this.dataSource = dataObj.list;

        this.pageNum = dataObj.pageNum;
        this.pageSize = dataObj.pageSize;
        this.total = dataObj.total;
      }
      else{
        this.notificationService.error(data.message)
      }
    })
  }
  
  handlePageEvent(event: PageEvent) {
    // //console.log(this.pageSizeOptions);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.onLoadData();
  }

  goToCrearHorario(){
    this.router.navigate([`/app/${AppRoute.HORARIOS}/${AppRoute.CREAR_HORARIO}`])
  }

  getDataFecha(value: any){
    this.form.get('frmSearchDate')?.setValue(value);
    var init = value.split(' - ')[0];
    var fin = value.split(' - ')[1];
    this.filtroFecInit = init.split('/')[2]+'-'+init.split('/')[1]+'-'+init.split('/')[0];
    this.filtroFecFin = fin.split('/')[2]+'-'+fin.split('/')[1]+'-'+fin.split('/')[0];
    this.onLoadData();
  }

  firstDisplayValue(value: any){
    this.form.get('frmSearchEstado')?.setValue(value);
    this.onLoadData();
  }
}
