import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { RequestBuscarApto } from '@models/control/asistencia/crud-asistencia.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'esp-dialog-confirm-data-asistencia',
  templateUrl: './dialog-confirm-data-asistencia.component.html',
  styleUrls: ['./dialog-confirm-data-asistencia.component.scss']
})
export class DialogConfirmDataAsistenciaComponent {
  status: RequestStatus = 'init';
  dataAsegurado: any = Object();

  constructor(@Inject(DIALOG_DATA) public data      : any,
              private datosService                  : DatosGeneralesService,
              private controlService                : ControlProgramacionService,
              private notificacionService           : NotificationService,
              private _dialogRef                    : DialogRef<any>) {

  }
  
  ngOnInit(){
    this.dataAsegurado = this.data.infoAsegurado.data[0];
  }

  onClose(){
    this._dialogRef.close();
  }

  registrar(){    
    this.status = 'loading';
    this.controlService.registerAseguradoDetalle({idControlAsistenciaDet: this.data.detalleAsistenciaActual.idControlAsistenciaDet, idFichaAdmision: this.dataAsegurado.idFichaAsegurado}).subscribe((datos)=>{
      if (datos.code == 0) {
        this.status = 'success';
        this.notificacionService.success('Se ha registrado la asistencia');
        this._dialogRef.close(1);
      }
      else{
        this.status = 'failed';
        this.notificacionService.warning(datos.message);
      }
    })
  }
}
