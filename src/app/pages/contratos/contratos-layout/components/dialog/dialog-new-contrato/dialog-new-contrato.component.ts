import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Parametro } from '@models/parametros-busqueda.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'esp-dialog-new-contrato',
  templateUrl: './dialog-new-contrato.component.html',
  styleUrls: ['./dialog-new-contrato.component.scss']
})
export class DialogNewContratoComponent {
  minDate = new Date();
  opciones: Parametro[] = [];
  status: RequestStatus = 'init';
  tipoDocSelected: any = Object();
  
  talleristaEncontrado = false;
  
  public formNewContrato = this.fb.nonNullable.group({
    frmSelectDoc: new FormControl(""),
    frmDoc: ['', [Validators.required, Validators.minLength(8)]],
  });
  public formVigencia = this.fb.nonNullable.group({
    frmInicioVigencia: [null, [Validators.required]],
    frmFinVigencia: [null, [Validators.required]],
  });

  constructor(private fb                                  : FormBuilder,
              private router                              : Router,
              private datosService                        : DatosGeneralesService,
              private notificationService                 : NotificationService,
              private _dialogRef                          : DialogRef<DialogNewContratoComponent>) {

  }

  ngOnInit(){
    this.formNewContrato.controls.frmSelectDoc.valueChanges.subscribe((data)=>{
      this.tipoDocSelected = this.opciones.find((x)=> x.valor1 == data);
    })
    this.formVigencia.controls.frmInicioVigencia.valueChanges.subscribe((data) => {
      const dataStr = String(data)
      this.minDate = new Date(parseInt(dataStr.split('/')[2]), parseInt(dataStr.split('/')[1]) - 1, parseInt(dataStr.split('/')[0]))
    })
    this.datosService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data) =>{
      // console.log(data);
      this.opciones = data.data;
    });
  }

  actualizarDate(input: any, opt: number) {
    if (input == '') {
      input = null;
    }
    switch (opt) {
      case 1:
        this.formVigencia.controls.frmInicioVigencia.setValue(input)
        break;
      case 2:
        this.formVigencia.controls.frmFinVigencia.setValue(input)
        break;
    }
  }

  onClose(){
    this._dialogRef.close();
  }

  onSearch(){
    this._dialogRef.close();
    this.router.navigate([`app/${AppRoute.CONTRATOS}/${AppRoute.CONTRATOS_ASIGNAR_SERVICIOS}`])
  }

}
