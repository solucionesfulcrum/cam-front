import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { ContratosAdministracionService } from 'src/app/data/services/contratos/contratos-administracion.service';

export interface NotificationDialog {
  title: string;
  message?: string;
  type: number;
  dataRequired: any;
  estado: any;
}

@Component({
  selector: 'esp-dialog-confirm-selection',
  templateUrl: './dialog-confirm-selection.component.html',
  styleUrls: ['./dialog-confirm-selection.component.scss']
})
export class DialogConfirmSelectionComponent {
  status: RequestStatus = 'init';
  constructor(@Inject(DIALOG_DATA) public data  : NotificationDialog,
              private _dialogRef                    : DialogRef<any>,
              private contratoService               : ContratosAdministracionService,
              private notificationService           : NotificationService) {}

  ngOnInit(): void {}

  onClose(){
    this._dialogRef.close(0);
  }

  onConfirm(){
    this.status = 'loading';
    if (this.data.type == 0) {
      let metodo;
      if(this.data.estado == 'CONFIRMADO'){
        metodo = this.contratoService.deleteContratoNacional(this.data.dataRequired)
      }
      
      else{
        metodo = this.contratoService.deleteContrato(this.data.dataRequired);
      }
      metodo.subscribe((data)=>{
        if (data.code == 0) {
          this.status = 'success';
          this._dialogRef.close(1);
          this.notificationService.success('Se eliminó el registro');  
        }
        else {
          this.status = 'failed';
          this.notificationService.warning(data.message);  
        }
      })
    }
    else if (this.data.type == 1){
      this.status = 'loading';
      this.contratoService.saveDataDetalleContrato(this.data.dataRequired).subscribe((data)=>{
        if (data.code == 0) {
          this.contratoService.confirmContrato(this.data.dataRequired.numOc).subscribe((datos)=>{
            if (datos.code == 0) {
              this.status = 'success';
              this.notificationService.success('¡Se guardaron los datos del contrato!');
              this._dialogRef.close(1);
            }
            else{
              this.status = 'failed';
              this.notificationService.warning(datos.message);
            }            
          })
        }
        else{
          this.status = 'failed';
          this.notificationService.warning(data.message);
        }
      })
    }
  }

}
