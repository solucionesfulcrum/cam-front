import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogConfirmacionRegistroComponent } from '../dialog-confirmacion-registro/dialog-confirmacion-registro.component';
import { AdmisionCitasService } from '@services/admision/admision-citas.service';

@Component({
  selector: 'esp-dialog-recordatorio',
  templateUrl: './dialog-recordatorio.component.html',
  styleUrls: ['./dialog-recordatorio.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class DialogRecordatorioComponent {

  posiblesHorarios: any[] = [];

  formCita = this.fb.nonNullable.group({
    frmActividad:[null],
    frmProfesional:[null],
    frmProfesionalCargo:[null],
    frmFecha:[''],
    frmHora:[null, Validators.required]
  });

  constructor(@Inject(DIALOG_DATA) public data      : any,/*horario fecha actividad cantCitas profesional numHist citaId */
              private fb                            : FormBuilder,
              public datepipe                       : DatePipe,
              private dialog                        : Dialog,
              private activeRoute                   : ActivatedRoute,
              private citasService                  : AdmisionCitasService,
              private _dialogRef                    : DialogRef<DialogRecordatorioComponent>,) {

  }

  ngOnInit(): void {
    this.establecerRangos();

    this.formCita.controls.frmActividad.setValue(this.data.actividad.nombreActividad);
    this.formCita.controls.frmProfesional.setValue(this.data.profesional.nombreProfesional);
    this.formCita.controls.frmProfesionalCargo.setValue(this.data.profesional.cargo);
    this.formCita.controls.frmFecha.setValue(this.datepipe.transform(this.data.fecha, "EEEE dd \'de\' MMMM \'de\' yyyy")!);
    // if (this.data.actividad !== 'Todos los Profesionales') {
    //   this.formCita.controls.frmProfesional.setValue(this.data.profesional.nombreProfesional);
    // }
  }

  establecerRangos(){
    let horaElegida = (this.data.horario.split(' ')[1] == 'PM' && this.data.horario.split(' ')[0] !== '12') ? parseInt(this.data.horario.split(' ')[0]) + 12 : parseInt(this.data.horario.split(' ')[0]);
    let horaUsarInicio = new Date(this.data.fecha.getTime() + 1000*60*60* horaElegida);
    let posiblesOcupados = [];

    if (this.data.tieneAsignacion == 2) {
      posiblesOcupados = this.citasService.getAsignacionesEnHora(horaUsarInicio, this.data.profesional.idProfesional , this.data.actividad.id)
    }
    else{
      posiblesOcupados = [Object()];
    }

    if (this.data.actividad.tipoTiempo === 'Hora') {
      let horaAumentada = new Date (horaUsarInicio.getTime() + 1000*60*60)
      let horaFormat = `${this.datepipe.transform(horaUsarInicio, "hh:mm aa")} - ${this.datepipe.transform(horaAumentada, "hh:mm aa")}`;

      this.posiblesHorarios.push({horaFormateada: horaFormat, horaComienzo: horaUsarInicio, horaReal: horaAumentada});
    }
    else{
      for (let i = 0; i < this.data.cantCitas; i++) {
        let horaAumentada = new Date (horaUsarInicio.getTime() + 1000*60*this.data.actividad.tiempo)
        let horaFormat = `${this.datepipe.transform(horaUsarInicio, "hh:mm aa")} - ${this.datepipe.transform(horaAumentada, "hh:mm aa")}`;
        let deshabilitado = false;

        if(this.data.tieneAsignacion == 2){
          if(posiblesOcupados.some(item => item.horarioAsignado.getTime() == horaUsarInicio.getTime())){
            deshabilitado = true;
          }
        }
        this.posiblesHorarios.push({horaFormateada: horaFormat, horaComienzo: horaUsarInicio, horaReal: horaAumentada, deshabilitado: deshabilitado});
        
        horaUsarInicio = horaAumentada;
      }
    }
  }

  onClose(){
    this._dialogRef.close();
  }
  onSave(){
    if (this.formCita.valid) {
      this.citasService.guardarCitaAsignacion(new Date(this.formCita.controls.frmHora.value!), this.data.profesional.idProfesional , this.data.actividad.id);
      this._dialogRef.close();
      const dialogRef = this.dialog.open(DialogConfirmacionRegistroComponent,{
        data:{
          numHist: this.activeRoute.snapshot.paramMap.get('numHist')
        }
      })
    }
  }
}
