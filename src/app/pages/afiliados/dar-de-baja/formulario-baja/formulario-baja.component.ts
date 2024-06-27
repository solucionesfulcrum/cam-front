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

@Component({
  selector: 'esp-formulario-baja',
  templateUrl: './formulario-baja.component.html',
  styleUrls: ['./formulario-baja.component.scss']
})
export class FormularioBajaComponent {
  status: RequestStatus = 'init';
  frmCtrlMotivo = new FormControl('');
  frmCtrlDescMotivo = new FormControl('');
  registrosNotas: any[] = [];
  idUserSession = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario;

  constructor(@Inject(DIALOG_DATA) public data                : any,
              private solicitudServicio                       : AfiliacionesSolicitudesService,
              private notificationService                     : NotificationService,
              private fb                                      : FormBuilder,
              private dialog: MatDialog,
              private _dialogRef                              : MatDialogRef<DialogNotasComponent>,) {

  }

  ngOnInit(){
    this.frmCtrlMotivo.addValidators([Validators.required]);
    this.frmCtrlDescMotivo.addValidators([Validators.required]);
    this.loadData();
  }

  loadData(){
    this.solicitudServicio.listarNotaSolicitud(this.data.idSolicitud).subscribe((data)=>{
      if (data.code == 0) {
        this.registrosNotas = data.data;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
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
          descripcion: this.frmCtrlDescMotivo.value
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
