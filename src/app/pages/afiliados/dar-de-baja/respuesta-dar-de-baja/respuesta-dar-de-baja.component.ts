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

  motivos:  { [key: string]: string } = {
    '1': 'Traslado de Centro',
    '2': 'Retiro Voluntario',
    '3': 'Indisciplina',
    '4': 'Ausencia mayor a 8 Meses',
    '5': 'Fallecimiento' 
  };
  
  constructor(
    @Inject(DIALOG_DATA) public data      : RespuestaDarDeBajaComponent,
    private _dialogRef                    : MatDialogRef<any>) 
    {

      this.motivo = data.motivo;
      this.observacion = data.observacion;
      this.afiliado = data.afiliado;
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
