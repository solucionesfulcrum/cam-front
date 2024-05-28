import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { RequestListTallerista } from '@models/contactos/talleristas/contactos-talleristas.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { NotificationService } from '@services/notification.service';
import { ContactosTalleristasService } from 'src/app/data/services/contactos/contactos-talleristas.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'app-contactos-talleristas',
  templateUrl: './contactos-talleristas.component.html',
  styleUrls: ['./contactos-talleristas.component.css']
})
export class ContactosTalleristasComponent implements OnInit {

  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchEstado:new FormControl(),
    frmSearchAccion:new FormControl(),
    frmSearchCam:new FormControl(""),
  });
  columns: string[] = ['marcar','nombres','tipoDoc','numDoc', 'telefono', 'correo','perfil'];
  
  dataSource: any[] = [];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;

  opciones_cam: Parametro[] = [];
  opciones: Parametro[] = [];


  rol: string = '';
  
  constructor(private fb                                    : FormBuilder,
              private talleristaService                     : ContactosTalleristasService,
              private notificationService                   : NotificationService,
              private datosService            : DatosGeneralesService,) { }

  ngOnInit(): void {
    this.onLoadData();

    this.datosService.getTipoParametros('ESTADO_FICHA_ADMISION').subscribe((data)=>{
      this.opciones = data.data;
    });

    
    this.datosService.getCams(JSON.parse(localStorage.getItem("UnidElegida")!).idUnidOperativa).subscribe((data)=>{
      this.opciones_cam = data.data.map((e : any)=>{ //No había más solución
        return {...e, idParametros: e.codigo} as Parametro
      });
    });
    
    this.rol = JSON.parse(localStorage.getItem('UnidElegida')!).rol;
  }

  onLoadData(){
    this.talleristaService.getTalleristaList(this.getPayloadList()).subscribe((data)=>{
      if (data.code == 0) {
        console.log(data.data.list)
        this.dataSource = data.data.list;
        this.pageNum = data.data.pageNum;
        this.pageSize = data.data.pageSize;
        this.total = data.data.total;
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

  getPayloadList(): RequestListTallerista{
    return {
      idUnidOpe: JSON.parse(localStorage.getItem("UnidElegida")!).idUnidOperativa,
      texto: this.formBuscar.controls['frmSearch'].value,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }
  }
  
  handlePageEvent(event: PageEvent) {
    // console.log(this.pageSizeOptions);
    console.log(event)
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.onLoadData();
  }

    
  secDisplayValue(value: any){
    this.formBuscar.get('frmSearchCam')?.setValue(value);
    this.onLoadData();
  }
}
