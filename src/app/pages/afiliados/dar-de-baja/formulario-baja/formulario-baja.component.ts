import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { RegisterNota } from '@models/afiliaciones/register-afiliacion.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { DialogNotasComponent } from '../../show-sol/dialog-notas/dialog-notas.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalConfirmarGenericoComponent } from '@shared/components/modal-confirmar-generico/modal-confirmar-generico.component';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { Parametro } from '@models/parametros-busqueda.model';

@Component({
  selector: 'esp-formulario-baja',
  templateUrl: './formulario-baja.component.html',
  styleUrls: ['./formulario-baja.component.scss']
})
export class FormularioBajaComponent {
  opciones: Parametro[] = [];
  status: RequestStatus = 'init';
  frmCtrlMotivo = new FormControl('');
  frmCtrlDescMotivo = new FormControl('');
  txtMotivo : string = '';
  registrosNotas: any[] = [];
  idUserSession = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario;

  constructor(@Inject(DIALOG_DATA) public data                : any,
              private solicitudServicio                       : AfiliacionesSolicitudesService,
              private notificationService                     : NotificationService,
              private fb                                      : FormBuilder,
              private dialog: MatDialog,
              private _dialogRef                              : MatDialogRef<DialogNotasComponent>,
              private datosService             : DatosGeneralesService,) {

  }

  ngOnInit(){
    this.frmCtrlMotivo.addValidators([Validators.required]);
    this.frmCtrlDescMotivo.addValidators([Validators.required]);
    this.frmCtrlMotivo.valueChanges.subscribe(()=>{
      this.txtMotivo = this.opciones.filter(e => String(e.idParametros) == this.frmCtrlMotivo.value)[0].nombre;
    })
    this.loadData();
  }

  loadData(){
    this.datosService.getTipoParametros('MOTIVO_BAJA_FICHA_ADMISION').subscribe((data)=>{
      if (data.code == 0) {
        this.opciones = data.data
      }
      else{
        this.notificationService.warning(data.message);
      }
    });
  }

  onClose(){
    
  }

  darDeBaja(){
    this.frmCtrlMotivo.markAsTouched();
    this.frmCtrlDescMotivo.markAsTouched();
    if(this.frmCtrlMotivo.valid && this.frmCtrlDescMotivo.valid){
      this._dialogRef.close({
        success: true,
        data:{
          motivo: this.frmCtrlMotivo.value,
          txtMotivo: this.txtMotivo,
          descripcion: this.frmCtrlDescMotivo.value,
        }
      });
    }
  }

  onSave(){
   /* if (this.frmCtrlNota.valid) {
      this.status = 'loading';
      this.solicitudServicio.registerNotaSolicitud(this.getModel()).subscribe((data)=>{
        if (data.code == 0) {
          this.frmCtrlNota.reset()
          this.notificationService.success('Se registró la nota en la solicitud');
          this.loadData();
          this.status = 'success';
        }
        else{
          this.notificationService.warning(data.message);
          this.status = 'failed';
        }
      })
    }
    else{
      this.frmCtrlNota.markAllAsTouched();
    }*/
  }

   /* getModel(): RegisterNota{
  return {
      idFichaAdmision: this.data.idSolicitud,
      nota: this.frmCtrlNota.value!,
      idUsuarioReg: this.idUserSession
    }
  }*/
}
