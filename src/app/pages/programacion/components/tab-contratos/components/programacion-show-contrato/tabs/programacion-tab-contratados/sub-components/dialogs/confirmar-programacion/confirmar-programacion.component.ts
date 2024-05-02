import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { ProgramacionContratosService } from 'src/app/data/services/programacion/programacion-contratos.service';

export interface NotificationDialog {
  title: string;
  message?: string;
  dataRequired: any;
}

@Component({
  selector: 'esp-confirmar-programacion',
  templateUrl: './confirmar-programacion.component.html',
  styleUrls: ['./confirmar-programacion.component.scss']
})
export class ConfirmarProgramacionComponent {
  status: RequestStatus = 'init';
  constructor(@Inject(DIALOG_DATA) public data      : NotificationDialog,
              private _dialogRef                    : DialogRef<any>,
              private programacionService           : ProgramacionContratosService,
              private notificationService           : NotificationService) {}

  ngOnInit(): void {}

  onClose(){
    this._dialogRef.close(0);
  }

  onConfirm(){
    this.status = 'loading';
    this.programacionService.publicarProgramacion(this.data.dataRequired).subscribe((data)=>{
      if (data.code == 0) {
        this.status = 'success';
        this._dialogRef.close(1);
        this.notificationService.success('Se publicó la programación');  
      }
      else {
        this.status = 'failed';
        this.notificationService.warning(data.message);  
      }
    })
  }


}
