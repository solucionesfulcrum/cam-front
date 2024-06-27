import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'esp-respuesta-dar-de-baja',
  templateUrl: './respuesta-dar-de-baja.component.html',
  styleUrls: ['./respuesta-dar-de-baja.component.scss']
})
export class RespuestaDarDeBajaComponent {
  faClose = faClose

  motivo! : number;
  observacion! : string;
  afiliado! : string;
  txtMotivo!: string;

  constructor(
    @Inject(DIALOG_DATA) public data      : RespuestaDarDeBajaComponent,
    private _dialogRef                    : MatDialogRef<any>) 
    {

      this.motivo = data.motivo;
      this.observacion = data.observacion;
      this.afiliado = data.afiliado;
      this.txtMotivo = data.txtMotivo
  }

  onClose(){
    this._dialogRef.close();
    }

  ok(){
    this._dialogRef.close({
      success: true
    });
    }
}
