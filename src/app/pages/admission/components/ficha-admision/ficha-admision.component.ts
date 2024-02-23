import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { UsersService } from '@services/users.service';
import { iUserTable } from 'src/app/interfaces/user-table.interface';
import { Dialog } from '@angular/cdk/dialog';
import { AdmisionFichaService } from '@services/admision/admision-ficha.service';
import { fichasResponse } from '@models/admision/ficha-admision.model';
import { NewFichaAdmisionComponent } from './dialogs/new-ficha-admision/new-ficha-admision.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Parametro } from '@models/parametros-busqueda.model';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { NotificationService } from '@services/notification.service';
@Component({
  selector: 'esp-ficha-admision',
  templateUrl: './ficha-admision.component.html',
  styleUrls: ['./ficha-admision.component.scss'],
})
export class FichaAdmisionComponent implements OnInit{

  filtroFecInit!: string;
  filtroFecFin!: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = {} as MatPaginator;
  // dataSource!: MatTableDataSource<any>;
  // @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild(MatPaginator) paginator2!: MatPaginator;
  dataSource: fichasResponse[] = [];
  // dataSourceRespaldo: fichasResponse[] = [];

  columns: string[] = ['numHistClinica','fullName', 'documento', 'dni', 'date','status'];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:number[] = [5,10,20];
  total = 0;

  opciones: Parametro[] = [];
  
  idUnidadOperativaUser = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;

  form:FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
  });

  constructor(private fb:FormBuilder,
              private dialog : Dialog,
              private datosService: DatosGeneralesService,
              private notificationService: NotificationService,
              private AdmisionFichaService: AdmisionFichaService){
  }

  
  ngOnInit(): void {
    this.datosService.getTipoParametros('ESTADO_FICHA_ADMISION').subscribe((data)=>{
      this.opciones = data.data;
    });
    this.paginator._intl.itemsPerPageLabel="Registros por página";
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
    this.AdmisionFichaService.getFichasAdmision({
      "idUnidOpe":this.idUnidadOperativaUser,
      "texto": this.form.get('frmSearch')?.value,
      "fecInicio":fecInicio,
      "fecFin": fecFin,
      "pageNum": this.pageNum.toString(),
      "pageSize":this.pageSize.toString(),
      "estado": this.form.get('frmSearchEstado')?.value
    })
      .subscribe(data =>{
        console.log(data)
        if (data.code == 0) {
          const dataObj = Object(data.data);
          // this.dataSource = new MatTableDataSource(dataObj.list);
          // this.dataSource.paginator = this.paginator2;
          // this.dataSource.sort = this.sort;
          // console.log(this.dataSource);
          this.dataSource = dataObj.list;
          this.dataSource.sort((a,b)=>{
            return b.id - a.id
          })
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
    // console.log(this.pageSizeOptions);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.onLoadData();
  }

  showNuevaFichaAdmision(){
    const dialogRef = this.dialog.open(NewFichaAdmisionComponent,{
      minWidth:'800px',
      maxWidth:'50%',
      data:{}
    })
    dialogRef.closed.subscribe(out =>{
      // console.log(out)
    })
  }

  AsignarFiltro(filtro: string){
    this.form.get('frmSearchDate')?.setValue(filtro);
    var init = filtro.split(' - ')[0];
    var fin = filtro.split(' - ')[1];
    this.filtroFecInit = init.split('/')[2]+'-'+init.split('/')[1]+'-'+init.split('/')[0];
    this.filtroFecFin = fin.split('/')[2]+'-'+fin.split('/')[1]+'-'+fin.split('/')[0];
    this.onLoadData();
  }

  firstDisplayValue(value: any){
    this.form.get('frmSearchEstado')?.setValue(value);
    this.onLoadData();
  }

  showResult(n: any){
    console.log(n);
  }

}
