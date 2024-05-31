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
    console.log(this.data)
    this.dataAsegurado = this.data.infoAsegurado.data[0];
  }

  onClose(){
    this._dialogRef.close();
  }

  registrar(){    
    this.status = 'loading';
    this.controlService.registerAseguradoDetalle({idControlAsistenciaDet: this.data.detalleAsistenciaActual.idControlAsistenciaDet, idFichaAdmision: this.dataAsegurado.idFichaAsegurado, conConexion: this.data.conConexion}).subscribe((datos)=>{
      if (datos.code == 0) {
        if (this.data.detalleAsistenciaActual.numeracion == 1) {
          if (this.data.listPreInscritos.some((x: any)=> x.numDoc == this.dataAsegurado.numDoc)) {
            this.controlService.registerAsistenciaAsistira({idProgramacionDet: JSON.parse(localStorage.getItem('idProgramElegida')!), idFichaAdmision: this.dataAsegurado.idFichaAsegurado}).subscribe((dataAsistira)=>{
              if (dataAsistira.code == 0) {
                this.status = 'success';
                this.notificacionService.success('Se ha registrado la asistencia');
                this._dialogRef.close(2);
              }
              else{
                this.status = 'failed';
                this.notificacionService.warning(dataAsistira.message);                
              }
            })
          }
          else{            
            this.status = 'success';
            this.notificacionService.success('Se ha registrado la asistencia');
            this._dialogRef.close(1);
          }
        }
        else{
          this.status = 'success';
          this.notificacionService.success('Se ha registrado la asistencia');
          this._dialogRef.close(1);
        }
      }
      else{
        this.status = 'failed';
        this.notificacionService.warning(datos.message);
      }
    })
  }
}
