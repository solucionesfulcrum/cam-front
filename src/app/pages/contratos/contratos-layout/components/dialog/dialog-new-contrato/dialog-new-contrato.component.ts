import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestSendCabeceraContrato } from '@models/contratos/contratos-administracion.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { ContratosAdministracionService } from 'src/app/data/services/contratos/contratos-administracion.service';
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

  talleristaInfo: any;
  
  public formNewContrato = this.fb.nonNullable.group({
    frmSelectDoc: new FormControl(null),
    frmDoc: ['', [Validators.required, Validators.minLength(8)]],
  });
  public formVigencia = this.fb.nonNullable.group({
    frmInicioVigencia: [null, [Validators.required]],
    frmFinVigencia: [null, [Validators.required]],
  });
  public formDataOrden = this.fb.nonNullable.group({
    frmOrden: [null, [Validators.required]],
    frmMonto: [null, [Validators.required]],
  });

  constructor(private fb                                  : FormBuilder,
              private router                              : Router,
              @Inject(DIALOG_DATA) public data            : any,
              private datosService                        : DatosGeneralesService,
              private contratosService                    : ContratosAdministracionService,
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

  searchDataPersona(opt: number){
    if (opt == 1) {
      this.contratosService.searchForPerson({tipoDoc: this.formNewContrato.controls.frmSelectDoc.value!, numDoc: this.formNewContrato.controls.frmDoc.value!}).subscribe((data)=>{
        if (data.code == 0) {
          this.talleristaInfo = data.data;
          this.formNewContrato.disable()
        }
        else{
          this.notificationService.warning(data.message);
        }
      })
    }
    else{
      this.formNewContrato.enable()
      this.formNewContrato.reset();
      this.talleristaInfo = null;
    }
  }

  generateContract(){
    if (this.talleristaInfo && this.formVigencia.valid && this.formDataOrden.valid) {
      console.log(this.getCabeceraPayload())
    }
    else{
      this.formDataOrden.markAllAsTouched();
      this.formVigencia.markAllAsTouched();
    }
    // this._dialogRef.close();
    // this.router.navigate([`app/${AppRoute.CONTRATOS}/${AppRoute.CONTRATOS_ASIGNAR_SERVICIOS}`])
  }

  getCabeceraPayload(): RequestSendCabeceraContrato{
    return {
      cabecera: {
        idUsuarioTallerista: this.talleristaInfo.idUsuario,
        numOc: this.formDataOrden.controls.frmOrden.value!,
        fechaInicio: this.formVigencia.controls.frmInicioVigencia.value!,
        fechaFin: this.formVigencia.controls.frmFinVigencia.value!,
        monto: this.formDataOrden.controls.frmMonto.value!,
        usuarioRegId: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario
      },
      detalle: [
        {
          idUnidadOperativa: this.data.idUnid,
          tipoOrigenUnidad: "MISMA_UNIDAD"
        }
      ]
    }
  }
}
