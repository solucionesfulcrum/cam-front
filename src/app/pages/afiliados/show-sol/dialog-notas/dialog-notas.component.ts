import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { RegisterNota } from '@models/afiliaciones/register-afiliacion.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';

@Component({
  selector: 'esp-dialog-notas',
  templateUrl: './dialog-notas.component.html',
  styleUrls: ['./dialog-notas.component.scss']
})
export class DialogNotasComponent {
  status: RequestStatus = 'init';
  estadoAfi: string = '';
  estado!: number;
  frmCtrlNota = new FormControl();
  registrosNotas: any[] = [];
  idUserSession = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario;

  constructor(@Inject(DIALOG_DATA) public data                : any,
              private solicitudServicio                       : AfiliacionesSolicitudesService,
              private notificationService                     : NotificationService,
              private fb                                      : FormBuilder,
              private _dialogRef                              : DialogRef<DialogNotasComponent>,) {
    this.estado = data.estado;
    if(!this.estado){
      this.estadoAfi = 'ACTIVO';
    }
    else{
      if(this.estado == 13 || this.estado == 14){
        this.estadoAfi = 'ACTIVO';
      }
      else{
        this.estadoAfi = 'BAJA';
      }
    }

  }

  ngOnInit(){
    this.frmCtrlNota.addValidators([Validators.required]);
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
    this._dialogRef.close();
  }

  onSave(){
    if (this.frmCtrlNota.valid) {
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
    }
  }

  getModel(): RegisterNota{
    return {
      idFichaAdmision: this.data.idSolicitud,
      nota: this.frmCtrlNota.value,
      idUsuarioReg: this.idUserSession
    }
  }
}
