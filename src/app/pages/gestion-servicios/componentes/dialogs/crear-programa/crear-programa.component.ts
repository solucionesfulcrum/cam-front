import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'esp-crear-programa',
  templateUrl: './crear-programa.component.html',
  styleUrls: ['./crear-programa.component.scss']
})
export class CrearProgramaComponent {
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
