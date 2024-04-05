import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { RequestListTallerista } from '@models/contactos/talleristas/contactos-talleristas.model';
import { NotificationService } from '@services/notification.service';
import { ContactosTalleristasService } from 'src/app/data/services/contactos/contactos-talleristas.service';

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
  });
  columns: string[] = ['marcar','nombres','tipoDoc','numDoc', 'telefono', 'correo','perfil'];
  
  dataSource: any[] = [];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions:  number[] = [5,10,20];
  total = 0;
  
  constructor(private fb                                    : FormBuilder,
              private talleristaService                     : ContactosTalleristasService,
              private notificationService                   : NotificationService) { }

  ngOnInit(): void {
    this.onLoadData();
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
}
