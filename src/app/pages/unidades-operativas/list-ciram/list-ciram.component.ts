import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Parametro } from '@models/parametros-busqueda.model';
import { UsersService } from '@services/users.service';
import { DataResponse, UnidadOperativa, UnidadOperativaCiram } from 'src/app/interfaces/unit.op.interface';
import { DataSourceList } from '../list/data-source';

@Component({
  selector: 'esp-list-ciram',
  templateUrl: './list-ciram.component.html',
  styleUrls: ['./list-ciram.component.scss']
})
export class ListCiramComponent {
  today = new Date();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = {} as MatPaginator;
  dataCompleted:any[] = [];
  dataSource = new DataSourceList();

  columns: string[] = ['id','unidad', 'categoria', 'telefono', 'distrito','red','fechaRegistro'];
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

  //DATOS ESTATICOS:
  dataResponse: DataResponse<UnidadOperativaCiram> = {
    data:{
      list: [
        {
          id: 1,
          unidad: 'CAM la Victoria',
          categoria: 'Nivel 1',
          telefono: '323-9331',
          distrito: 'La Victoria',
          red: 'RED ASISTENCIAL ALMENARA',
          fechaRegistro: new Date('2024-02-12')
        },
        {
          id: 2,
          unidad: 'CAM Callao',
          categoria: 'Nivel 1',
          telefono: '465-8102',
          distrito: 'La Bellavista',
          red: 'RED ASISTENCIAL SABOGAL',
          fechaRegistro: new Date('2024-02-12')
        },
        {
          id: 3,
          unidad: 'CAM Piura',
          categoria: 'Nivel 1',
          telefono: '073-3366755',
          distrito: 'Piura',
          red: 'RED ASISTENCIAL PIURA',
          fechaRegistro: new Date('2024-02-12')
        },
        {
          id: 4,
          unidad: 'CAM Arequipa',
          categoria: 'Nivel 1',
          telefono: '054-259546',
          distrito: 'Zamácola',
          red: 'RED ASISTENCIAL AREQUIPA',
          fechaRegistro: new Date('2024-02-12')
        }
      ],
      pageNum: 1,
      pageSize: 5,
      total: 4
    }
    
  };

  public get searchForm(){
    return this.form.get("search");
  }
  constructor(private usersService:UsersService,
    private fb:FormBuilder){
  }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel="Registros por página";
    this.onFilter('');

    //MOMENTANEO
    this.llenarDatosTabla(this.dataResponse);
  }
  onLoadData(){
    var fecInicio: any;
    var fecFin: any;

    //MAQUETA
    //this.llenarDatosTabla(this.dataResponse);

    /*if (this.form.value.frmSearchDate == '') {
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
      console.log(data);
      this.dataCompleted = data.data.list;
      this.dataSource.init(data.data.list)

      this.pageNum = data.data.pageNum;
      this.pageSize = data.data.pageSize;
      this.total = data.data.total;
    })*/
  }

  llenarDatosTabla(data : DataResponse<UnidadOperativa>){
    this.dataCompleted = data.data.list;
    this.dataSource.init(data.data.list)

    this.pageNum = data.data.pageNum;
    this.pageSize = data.data.pageSize;
    this.total = data.data.total;
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

}
