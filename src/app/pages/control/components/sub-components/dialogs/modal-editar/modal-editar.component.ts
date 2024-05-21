import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'esp-modal-editar',
  templateUrl: './modal-editar.component.html',
  styleUrls: ['./modal-editar.component.scss']
})
export class ModalEditarComponent {
  constructor(@Inject(DIALOG_DATA) public data      : any,
 
  private _dialogRef                    : MatDialogRef<any>) {

}

ngOnInit(){
console.log(this.data);
}

onClose(){
this._dialogRef.close();
}

okBtn(){
  this._dialogRef.close({success: true});
}
}
