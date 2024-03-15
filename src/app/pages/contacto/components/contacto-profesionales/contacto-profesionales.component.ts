import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ContactoProfesionalesService } from '@services/contacto/contacto-profesionales.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'esp-contacto-profesionales',
  templateUrl: './contacto-profesionales.component.html',
  styleUrls: ['./contacto-profesionales.component.scss']
})
export class ContactoProfesionalesComponent {
  columns: string[] = ['id','nombreProfesional','tipoDoc', 'numDoc', 'telefono', 'correo','perfil'];

  searchInput: string = '';
  dataSource: any[] = [];
  estadoProfesionalElegido = null;
  accionElegida = null;
  idUnidadOperativaUser = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;
  
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:number[] = [5,10,20];
  total = 0;

  constructor(private contactoProfesionalesService          : ContactoProfesionalesService,
              private notificationService                   : NotificationService){

  }

  ngOnInit(){
    console.log(JSON.parse(localStorage.getItem('camUser')!))
    this.onLoad();
  }

  onLoad(){
    this.contactoProfesionalesService.getBandejaProfesionales({
      texto: this.searchInput,
      activo: "",
      unidOperativaId: this.idUnidadOperativaUser,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }).subscribe((data)=>{
      if (data.code == 0) {
        const dataObj = Object(data.data);
        console.log(dataObj)
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
  
  handlePageEvent(event: PageEvent) {
    // console.log(this.pageSizeOptions);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.onLoad();
  }
}
