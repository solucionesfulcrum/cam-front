import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-no-internet-dialog',
  templateUrl: './modal-sin-internet.component.html',
})
export class ModalSinInternetComponent {

  faClose = faClose
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private _dialogRef                    : DialogRef<any>
) {}

  onClose(){
    this._dialogRef.close();
    }
}
