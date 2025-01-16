import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'esp-dialog-confirmacion',
  templateUrl: './dialog-confirmacion.component.html',
  styleUrls: ['./dialog-confirmacion.component.scss']
})
export class DialogConfirmacionComponent {
  constructor(@Inject(DIALOG_DATA) public data                          : any,
              private _dialogRef                                        : DialogRef<any>,) {}
  
  onClose(){
    this._dialogRef.close(0);
  }

  onConfirm(){
    this._dialogRef.close(1);
  }
}
