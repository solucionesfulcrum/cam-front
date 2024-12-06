import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'esp-editar-sub-programa',
  templateUrl: './editar-sub-programa.component.html',
  styleUrls: ['./editar-sub-programa.component.scss']
})
export class EditarSubProgramaComponent {
  message: string = ''
  constructor(@Inject(DIALOG_DATA) public data      : any,
 
  private _dialogRef                    : MatDialogRef<any>) {
    this.message = data.message
}

ngOnInit(){
//console.log(this.data);
}

onClose(){
this._dialogRef.close({success: false});
}

okBtn(){
  this._dialogRef.close({success: true});
}
}
