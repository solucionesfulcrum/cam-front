import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'esp-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss']
})
export class ModalAlertComponent implements OnInit {
  mensaje: string = "";
  faClose = faClose
  constructor(@Inject(MAT_DIALOG_DATA) public data: ModalAlertComponent,
  private _dialogRef                    : DialogRef<any>
) {

  this.mensaje = data.mensaje
}

  onClose(){
    this._dialogRef.close();
    }

   ngOnInit(){

   }
}
