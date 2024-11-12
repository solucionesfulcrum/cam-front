import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { DialogNewContratoComponent } from '../dialog/dialog-new-contrato/dialog-new-contrato.component';
import { ContratosAdministracionService } from 'src/app/data/services/contratos/contratos-administracion.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RequestListContracts } from '@models/contratos/contratos-administracion.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Parametro } from '@models/parametros-busqueda.model';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { DialogConfirmSelectionComponent } from '../dialog/dialog-confirm-selection/dialog-confirm-selection.component';

@Component({
  selector: 'esp-contratos-listado',
  templateUrl: './contratos-listado.component.html',
  styleUrls: ['./contratos-listado.component.scss']
})
export class ContratosListadoComponent {
  appRoute = AppRoute;
  faSpinner = faSpinner;
  dataListCams!: any;
  filteredList!: any;
  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    frmSearchDate:new FormControl(""),
    frmSearchEstado:new FormControl(),
  });
  listContratos: any[] = [];
  optEstado: Parametro[] = [];

  ctrlSearchCam = new FormControl();

  camElegido: any;

  constructor(private fb                      : FormBuilder, 
              private dialog                  : Dialog,
              private contratosService        : ContratosAdministracionService,
              public notificationService     : NotificationService,
              private datosGeneralesService   : DatosGeneralesService,
              private sanitizer               : DomSanitizer,
              public router                  : Router, 
              private route                   : ActivatedRoute) { }
              
  ngOnInit(){
    this.datosGeneralesService.getTipoParametros('ESTADO_CONTRATO').subscribe((data)=>{
      if (data.code == 0) {
        this.optEstado = data.data;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
    this.contratosService.getListCamById().subscribe((data)=>{
      if (data.code == 0) {
        this.dataListCams = data.data[0];
        this.dataListCams.listarCam.forEach((x: any)=> x.activo = false);
        this.filteredList = this.dataListCams.listarCam;
        this.ctrlSearchCam.valueChanges.subscribe((data)=>{
          this.filteredList = this.dataListCams.listarCam.filter((x: any)=> {            
            return (x.listaCiram.length > 0 ? (x.nombreCam.toLowerCase().includes(data.toLowerCase())  || x.listaCiram.some((value: any)=> value.nombre.toLowerCase().includes(data.toLowerCase()))): x.nombreCam.toLowerCase().includes(data.toLowerCase()));
          })
        })
        // this.formBuscar.controls['frmSearchDate'].valueChanges.subscribe((datos)=>{
        //   if (!this.formBuscar.value.frmSearchDate) {
        //     this.setDataSelected(this.filteredList[0], 1)
        //   }
        // });
        this.camElegido = this.filteredList[0];
        this.camElegido.opt = 1;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  nuevoContrato(){
    if (this.camElegido) {
      const dialogRef = this.dialog.open(DialogNewContratoComponent,{
        minWidth:'900px',
        maxWidth:'50%',
        data:{
          idUnid: this.camElegido.idUnidadOperativa,
          type: 1
        }
      })
    }
    else{
      this.notificationService.warning('Seleccione un CAM o CIRAM')
    }
  }

  setDataSelected(obj: any, opt: number, event?: MouseEvent){
    if (event) {
      event.stopPropagation();
    }
    if (opt != 0) {
      if (this.camElegido) {
        if (this.camElegido.idUnidadOperativa != obj.idUnidadOperativa) {
          this.getDateFromService(obj.idUnidadOperativa)
        }
      }
      else{
        this.getDateFromService(obj.idUnidadOperativa)
      }
      this.camElegido = obj;
      this.camElegido.opt = opt;
    }
  }

  getDateFromService(optId?: number){
    let payload: any;
    if (optId) {
      payload = this.getPayloadList(optId);
    }
    else{
      if (this.camElegido) {
        payload = this.getPayloadList(this.camElegido.idUnidadOperativa);
      }
    }

    if (payload){
      this.contratosService.getListContratos(payload).subscribe((data)=>{
        if (data.code == 0) {
          this.listContratos = data.data.list;
        }
        else {
          this.notificationService.warning(data.message);
        }
      })
    }
  }

  getPayloadList(optId: number): RequestListContracts{
    var fecInicio: any;
    var fecFin: any;
    var fechaSinFormatInit = this.formBuscar.controls['frmSearchDate'].value.split(' - ')[0];
    var fechaSinFormatFin = this.formBuscar.controls['frmSearchDate'].value.split(' - ')[1];
    fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
    fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;
    return {
      idUnidOpe: optId,
      texto: this.formBuscar.controls['frmSearch'].value,
      fecInicio: fecInicio,
      fecFin: fecFin,
      estado: this.formBuscar.get('frmSearchEstado')?.value,
      pageNum: 1,
      pageSize: 100
    }
  }
  
  getDataFecha(value: any){
    this.formBuscar.get('frmSearchDate')?.setValue(value);
    this.getDateFromService();
  }

  downloadFile(ocSelected: any){
    if (ocSelected.fileOcNombre) {
      this.contratosService.getFileOc(ocSelected.numOc).subscribe((data)=>{
        const blob = new Blob([data], { type: 'application/pdf' });
        const data1 = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = data1;
        link.download = ocSelected.fileOcNombre; // set a name for the file
        link.click();
      })
    }
    else{
      this.notificationService.warning('La orden de compra ' + ocSelected.numOc + ' no registra un archivo adjunto');
    }
  }

  deleteItem(dataContrato: any){
    //console.log(dataContrato)
    const dialogRef = this.dialog.open(DialogConfirmSelectionComponent,{
      data:{
        title: '¿Quiere borrar el registro?',
        message: `Se eliminará la Orden de Compra ${dataContrato.numOc}`,
        type: 0,
        dataRequired: dataContrato.idContrato,
        estado: dataContrato.estado,
      }
    })

    dialogRef.closed.subscribe(result => {
      if (result == 1) {
        this.getDateFromService();
      }
    });
  }
}
