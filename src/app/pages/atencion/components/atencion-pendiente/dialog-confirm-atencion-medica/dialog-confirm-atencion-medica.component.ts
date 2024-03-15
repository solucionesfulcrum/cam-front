import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DatePipe, registerLocaleData } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdmisionCitasService } from '@services/admision/admision-citas.service';
import localeEs from '@angular/common/locales/es';
import { AtencionCitasService } from '@services/atencion/atencion-citas.service';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'esp-dialog-confirm-atencion-medica',
  templateUrl: './dialog-confirm-atencion-medica.component.html',
  styleUrls: ['./dialog-confirm-atencion-medica.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}],
})
export class DialogConfirmAtencionMedicaComponent {

  formCita = this.fb.nonNullable.group({
    frmActividad:[null],
    frmPaciente:[null],
    frmFecha:[''],
    frmHora:['']
  });

  datosActividad: any = null;
  
  constructor(@Inject(DIALOG_DATA) public data                          : any,
              private fb                                                : FormBuilder,
              public datepipe                                           : DatePipe,
              public atencionService                                    : AtencionCitasService,
              private admisionCitasService                              : AdmisionCitasService,
              private _dialogRef                                        : DialogRef<DialogConfirmAtencionMedicaComponent>,) {

  }

  ngOnInit(): void {this.atencionService.estadoBandeja
    this.datosActividad = this.admisionCitasService.actividadesInfo.find((x)=> {return x.nombreActividad === this.data.obj.actividadNombre})
    console.log(this.data)
    this.formCita.controls.frmActividad.setValue(this.data.obj.actividadNombre);
    this.formCita.controls.frmPaciente.setValue(this.data.obj.nombrePersona);
    this.formCita.controls.frmFecha.setValue(this.datepipe.transform(this.data.obj.fechaProgramadaInicio, "EEEE dd \'de\' MMMM \'de\' yyyy")!);
    console.log(this.data.obj.fechaProgramadaInicio.toTimeString())
    this.formCita.controls.frmHora.setValue(this.datepipe.transform(this.data.obj.fechaProgramadaInicio, "hh:mm aa")! + ' - ' + this.datepipe.transform(this.data.obj.fechaProgramadaFin, "hh:mm aa")!);
  }

  onClose(){
    this._dialogRef.close();
  }

  onSave(){
    console.log(1)
  }

}
