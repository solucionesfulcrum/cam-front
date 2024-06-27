import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'esp-modal-confirmar-generico',
  templateUrl: './modal-confirmar-generico.component.html',
  styleUrls: ['./modal-confirmar-generico.component.scss']
})
export class ModalConfirmarGenericoComponent {
  message: string = ''
  constructor(@Inject(DIALOG_DATA) public data      : any,
 
  private _dialogRef                    : MatDialogRef<any>) {
    this.message = data.message
}

ngOnInit(){
//console.log(this.data);
}

onClose(){
this._dialogRef.close();
}

okBtn(){
  this._dialogRef.close({success: true});
}
}
