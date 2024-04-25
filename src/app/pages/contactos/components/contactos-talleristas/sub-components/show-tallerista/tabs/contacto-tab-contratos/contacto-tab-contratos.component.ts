import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RequestListTalleristaContrato } from '@models/contactos/talleristas/contactos-talleristas.model';
import { NotificationService } from '@services/notification.service';
import { ContactosTalleristasService } from 'src/app/data/services/contactos/contactos-talleristas.service';

@Component({
  selector: 'esp-contacto-tab-contratos',
  templateUrl: './contacto-tab-contratos.component.html',
  styleUrls: ['./contacto-tab-contratos.component.scss']
})
export class ContactoTabContratosComponent {
  dataActivacion: any[] = [];
  dataContratos: any[] = [];
  idTallerista!: string;
  idUsuario: any;
  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
  });
  pageNum = 1;
  pageSize = 10;

  total = 0;
  // opcionesProcesos: any[] = [
  //   { procesoId: 1, nombre: 'Rehabilitación profesional', categoria: 'UNIDAD', orden: 1, usuarioRegId: 1, usuarioModId: null, fechReg: '2023-09-19T17:42:31.197', fechMod: null, activo: 1},
  //   { procesoId: 2, nombre: 'Rehabilitación social', categoria: 'UNIDAD', orden: 2, usuarioRegId: 1, usuarioModId: null, fechReg: '2023-09-19T17:42:31.197', fechMod: null, activo: 1},
  //   { procesoId: 3, nombre: 'Evaluación Inicial', categoria: 'UNIDAD', orden: 3, usuarioRegId: 1, usuarioModId: null, fechReg: '2023-09-19T17:42:31.197', fechMod: null, activo: 1},
  //   { procesoId: 4, nombre: 'Otras Actividades', categoria: 'GENERICO', orden: 4, usuarioRegId: 1, usuarioModId: null, fechReg: '2023-09-19T17:42:31.197', fechMod: null, activo: 1}
  // ];
  constructor(private fb                                    : FormBuilder,
              private talleristaService                     : ContactosTalleristasService,
              private activeRoute                           : ActivatedRoute,
              private notificationService                   : NotificationService) { 
                this.idTallerista = (this.activeRoute.snapshot.paramMap.get('idTallerista')!);
              }

  ngOnInit(): void {
    this.talleristaService.getDataTallerista(this.idTallerista).subscribe((data)=>{
      if (data.code == 0) {
        this.idUsuario = data.data.idUsuario;
        this.getActivacion()
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

  getActivacion(){
    this.talleristaService.getTalleristaActivacion(this.idUsuario).subscribe((data)=>{
      if (data.code == 0) {
        this.dataActivacion = data.data;
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

  getContratos(){
    console.log(this.payloadActivacion())
    this.talleristaService.getListContratosTallerista(this.payloadActivacion()).subscribe((data)=>{
      if (data.code == 0) {
        this.dataContratos = data.data.list;
        this.pageNum = data.data.pageNum;
        this.pageSize = data.data.pageSize;
        this.total = data.data.total;
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

  payloadActivacion(): RequestListTalleristaContrato{
    var fecInicio: any;
    var fecFin: any;
    var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
    var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
    fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
    fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;
    
    return {
      idUsuario: this.idUsuario,
      idUnidadOperativa: JSON.parse(localStorage.getItem("UnidElegida")!).idUnidOperativa,
      texto: this.formBuscar.controls['frmSearch'].value,
      fecInicio: fecInicio,
      fecFin: fecFin,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }
  }

}
