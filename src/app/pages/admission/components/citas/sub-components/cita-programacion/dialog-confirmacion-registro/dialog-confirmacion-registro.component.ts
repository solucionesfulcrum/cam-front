import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'esp-dialog-confirmacion-registro',
  templateUrl: './dialog-confirmacion-registro.component.html',
  styleUrls: ['./dialog-confirmacion-registro.component.scss']
})
export class DialogConfirmacionRegistroComponent {


  constructor(@Inject(DIALOG_DATA) public data      : any,
              private _dialogRef                    : DialogRef<DialogConfirmacionRegistroComponent>,) {

  }

  ngOnInit(): void {
    
  }

  onClose(){
    this._dialogRef.close();
  }
  onSave(){
    console.log(1)
  }
}
