import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HorarioAdministracionService } from '@services/horario/horario-administracion.service';
import { NotificationService } from '@services/notification.service';
import { AppRoute } from 'src/app/data/constants/app-route.constant';

@Component({
  selector: 'esp-confirm-create-horario',
  templateUrl: './confirm-create-horario.component.html',
  styleUrls: ['./confirm-create-horario.component.scss']
})
export class ConfirmCreateHorarioComponent {

  constructor(@Inject(DIALOG_DATA) public data      : any,
              private _dialogRef                    : DialogRef<ConfirmCreateHorarioComponent>,
              private router                        : Router,
              private notificationService           : NotificationService,
              private horariosService               : HorarioAdministracionService) {

  }

  ngOnInit(): void {
    //console.log(this.data)
  }

  onClose(){
    this._dialogRef.close();
  }
  onSave(){
    this.horariosService.registerHorarioAdministrativo(this.data.horario).subscribe((data)=>{
      if (data.code == 0) {
        let dataRegistro = this.horariosService.registerHorario(this.data.obj, data.data.horarioId)
        this.router.navigate([`app/schedule/${AppRoute.EDIT_HORARIO}/${data.data.horarioId}`])
        this._dialogRef.close();   
      }
      else{
        this.notificationService.warning(data.message);
      }
    }) 
  }
}
