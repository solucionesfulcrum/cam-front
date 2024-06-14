import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'esp-modal-asistencia-repetida',
  templateUrl: './modal-asistencia-repetida.component.html',
  styleUrls: ['./modal-asistencia-repetida.component.scss']
})
export class ModalAsistenciaRepetidaComponent {

  faClose = faClose

  msg : string = '';

  constructor(
    @Inject(DIALOG_DATA) public data      : ModalAsistenciaRepetidaComponent,
    private _dialogRef                    : DialogRef<any>) 
    {

      this.msg = data.msg
  }

  onClose(){
    this._dialogRef.close();
    }
}
