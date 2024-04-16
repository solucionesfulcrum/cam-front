import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'esp-dialog-add-programacion-asignacion',
  templateUrl: './dialog-add-programacion-asignacion.component.html',
  styleUrls: ['./dialog-add-programacion-asignacion.component.scss']
})
export class DialogAddProgramacionAsignacionComponent {

  formSchedule = this.fb.nonNullable.group({
    frmFecha:['', Validators.required],
    frmInicioHorario:['', Validators.required],
    frmFinHorario:['', Validators.required]
  });


  constructor(@Inject(DIALOG_DATA) public data      : any,
              private fb                            : FormBuilder,
              public datepipe                       : DatePipe,
              private notificacionService           : NotificationService,
              private _dialogRef                    : DialogRef<any>) {

  }


  ngOnInit(): void {
    console.log(this.data)
    // this.getActividades();
    this.formSchedule.controls.frmInicioHorario.setValue(null!)
    // this.setListeners();
    // this.transformDataDates()
    // this.listarHorariosDisponibles()

    if (this.data.horarioFijo) {
      this.formSchedule.controls.frmFecha.setValue(this.data.fechaHorario);
      this.formSchedule.controls.frmFecha.disable();
      this.formSchedule.controls.frmInicioHorario.setValue((new Date(`${this.data.fechaHorario.getFullYear()}-${this.data.fechaHorario.getMonth()+1}-${this.data.fechaHorario.getDate()} ${this.data.rangoHorario.split(' ')[0]}:00 ${this.data.rangoHorario.split(' ')[1]}`)).toString());
      this.formSchedule.controls.frmInicioHorario.disable();
    }
  }

}
