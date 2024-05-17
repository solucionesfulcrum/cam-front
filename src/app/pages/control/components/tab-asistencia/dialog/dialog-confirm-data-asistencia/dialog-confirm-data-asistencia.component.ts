import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { NotificationService } from '@services/notification.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'esp-dialog-confirm-data-asistencia',
  templateUrl: './dialog-confirm-data-asistencia.component.html',
  styleUrls: ['./dialog-confirm-data-asistencia.component.scss']
})
export class DialogConfirmDataAsistenciaComponent {

  constructor(@Inject(DIALOG_DATA) public data      : any,
              private datosService                  : DatosGeneralesService,
              private notificacionService           : NotificationService,
              private _dialogRef                    : DialogRef<any>) {

  }
  
  ngOnInit(){
    console.log(this.data);
  }

  onClose(){
    this._dialogRef.close();
  }
}
