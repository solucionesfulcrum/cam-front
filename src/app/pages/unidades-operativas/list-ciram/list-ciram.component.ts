import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Parametro } from '@models/parametros-busqueda.model';
import { UsersService } from '@services/users.service';
import { DataResponse, UnidadOperativa, UnidadOperativaCiram } from 'src/app/interfaces/unit.op.interface';
import { DataSourceList } from '../list/data-source';
import { NotificationService } from '@services/notification.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'esp-list-ciram',
  templateUrl: './list-ciram.component.html',
  styleUrls: ['./list-ciram.component.scss']
})
export class ListCiramComponent {
  today = new Date();

  @ViewChild("paginator") paginator!: MatPaginator;
  dataCompleted:any[] = [];
  dataSource = new MatTableDataSource<any>();

  columns: string[] = ['id','unidad', 'categoria', 'telefono', 'distrito','red','fechaRegistro'];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:number[] = [5,10,20];
  total = 0;
  nombreFilter = '';
  opcionesEstado: Parametro[] = [];
  opcionesRed: Parametro[] = [];

  form:FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(""),
    frmSearchRed: new FormControl(""),
  });
  filtroFecInit!: string;
  filtroFecFin!: string;

  seleccionados: number[] = [];

  public get searchForm(){
    return this.form.get("search");
  }
  constructor(
    private usersService:UsersService,
    private fb:FormBuilder,
    public notificationService     : NotificationService,
    private datosGeneralesService:DatosGeneralesService
  ){
  }

  ngOnInit(): void {
    this.datosGeneralesService.getTipoParametros('ESTADO_CONTRATO').subscribe((data)=>{
      if (data.code == 0) {
        this.opcionesEstado = data.data;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })

    this.datosGeneralesService.getUnidadesOperativas("").subscribe((data)=>{
      console.log(data)
      if (data.code == 0) {
        this.opcionesRed = data.data.map((cam : any)=> {
          return {...cam, valor1: cam.codigo}
        });
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
    //this.paginator._intl.itemsPerPageLabel="Registros por página";
    this.onFilter('');
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
    this.nombreFilter = String(this.form.value.frmSearch).toUpperCase()
    this.datosGeneralesService.getCamsCiram(
      this.form.get('frmSearch')?.value,
      this.form.get('frmSearchRed')?.value
  ).subscribe((data)=>{

      this.dataCompleted = data.data;
      this.dataSource.data = data.data;
      this.dataSource.paginator = this.paginator;

    })
  }


  onFilter(value: string){ //Momentaneo hasta que se tenga como campo en el servicio "Nombre a filtrar"
  }

  AsignarFiltro(filtro: string){
    this.form.get('frmSearchDate')?.setValue(filtro);
    var init = filtro.split(' - ')[0];
    var fin = filtro.split(' - ')[1];
    this.filtroFecInit = init.split('/')[2]+'-'+init.split('/')[1]+'-'+init.split('/')[0];
    this.filtroFecFin = fin.split('/')[2]+'-'+fin.split('/')[1]+'-'+fin.split('/')[0];
    this.pageIndex = 0;
    this.pageNum=1;
    this.onLoadData();
  }
  handlePageEvent(event: PageEvent) {
    // console.log(this.pageSizeOptions);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.onLoadData();
  }

  firstDisplayValue(value: any){
    if (value !== 'null') {
      this.form.get('frmSearchEstado')?.setValue(this.opcionesEstado.find((x)=>{return x.idParametros == value})?.nombre);
    }
    else{
      this.form.get('frmSearchEstado')?.setValue('');
    }
    this.pageIndex = 0;
    this.pageNum=1;
    this.onLoadData();
  }
  
  secDisplayValue(value: any){
    this.form.get('frmSearchRed')?.setValue(value == 'null' ? '' : value);
    this.onLoadData();
  }


}
