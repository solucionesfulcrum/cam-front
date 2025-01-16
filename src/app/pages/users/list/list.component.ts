import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { UsersComponent } from '../users/users.component';
import { DataSourceUser } from './data-source';
import { CdkTableModule } from '@angular/cdk/table';
import { UsersService } from '@services/users.service';
import { SharedModule } from '@shared/shared.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, } from 'rxjs';
import { iUserTable } from 'src/app/interfaces/user-table.interface';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { RequestListUsers } from '@models/usuario/user.model';
import { Parametro } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ListComponent implements OnInit{
  today = new Date();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = {} as MatPaginator;
  dataCompleted:any[] = [];
  dataSource = new DataSourceUser();

  loadingData = true;

  columns: string[] = ['id','fullName', 'dni', 'date', 'role','operativeUnit','status'];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:number[] = [5,10,20];
  total = 0;
  nombreFilter = '';
  opcionesEstado: Parametro[] = [{ idParametros: 1, tipo: "", idPradre: 1, nombre: "CREADO", valor1: "CREADO", valor2: "", descripcion: "", fechaRegistro: "", fechaModificacion: "", activo: true },
  { idParametros: 2, tipo: "", idPradre: 1, nombre: "CONFIRMADO", valor1: "CONFIRMADO", valor2: "", descripcion: "", fechaRegistro: "", fechaModificacion: "", activo: true },
  { idParametros: 3, tipo: "", idPradre: 1, nombre: "ACTIVADO", valor1: "ACTIVADO", valor2: "", descripcion: "", fechaRegistro: "", fechaModificacion: "", activo: true },
  { idParametros: 4, tipo: "", idPradre: 1, nombre: "INACTIVO", valor1: "INACTIVO", valor2: "", descripcion: "", fechaRegistro: "", fechaModificacion: "", activo: true },];

  form:FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(""),
  });
  filtroFecInit!: string;
  filtroFecFin!: string;

  public get searchForm(){
    return this.form.get("search");
  }
  constructor(private usersService:UsersService,
    private fb:FormBuilder){
  }

  ngOnInit(): void {
    this.onFilter('');
  }
  onLoadData(){
    var fecInicio: any;
    var fecFin: any;
    this.loadingData = true;

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
    this.usersService.listUsersSigps({
      texto:  this.nombreFilter,
      fecInicio: fecInicio,
      fecFin: fecFin,
      estado: this.form.value.frmSearchEstado,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }).subscribe((data)=>{

      this.loadingData = false;


      this.dataCompleted = data.data.list;
      this.dataSource.init(data.data.list)

      this.pageNum = data.data.pageNum;
      this.pageSize = data.data.pageSize;
      this.total = data.data.total;

      //this.paginator._intl.itemsPerPageLabel="Registros por página";

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
    // //console.log(this.pageSizeOptions);
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

}
