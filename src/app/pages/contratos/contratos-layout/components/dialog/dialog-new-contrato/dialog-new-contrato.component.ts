import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestEditCabecera, RequestSendCabeceraContrato } from '@models/contratos/contratos-administracion.model';
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

  retrievedPdf: any;
  nombrePdf = null;
  fileSize = '';
  applicationFile: any;
  isPdfUpdate = false;
  bloquearPDFAusente = false;
  comprobacionPDF = '';

  talleristaInfo: any;
  
  public formNewContrato = this.fb.nonNullable.group({
    frmSelectDoc: new FormControl(''),
    frmDoc: ['', [Validators.required, Validators.minLength(8)]],
  });
  public formVigencia = this.fb.nonNullable.group({
    frmInicioVigencia: ['', [Validators.required]],
    frmFinVigencia: ['', [Validators.required]],
  });
  public formDataOrden = this.fb.nonNullable.group({
    frmOrden: [null, [Validators.required]],
    frmEntregables: [null, [Validators.required]],
    frmMonto: [null, [Validators.required]],
  });

  constructor(private fb                                  : FormBuilder,
              private router                              : Router,
              @Inject(DIALOG_DATA) public data            : any,
              @Inject(LOCALE_ID) private locale           : string,
              private datosService                        : DatosGeneralesService,
              private contratosService                    : ContratosAdministracionService,
              private notificationService                 : NotificationService,
              private _dialogRef                          : DialogRef<any>) {

  }

  ngOnInit(){
    this.formNewContrato.controls.frmSelectDoc.valueChanges.subscribe((data)=>{
      this.tipoDocSelected = this.opciones.find((x)=> x.valor1 == data);
    })
    this.formDataOrden.controls.frmOrden.valueChanges.subscribe((val: any) => {
      if (val) {
        this.formDataOrden.controls.frmOrden.setValue(val.trim(), { emitEvent: false })
      }
    })
    this.formVigencia.controls.frmInicioVigencia.valueChanges.subscribe((data) => {
      const dataStr = String(data)
      this.minDate = new Date(parseInt(dataStr.split('/')[2]), parseInt(dataStr.split('/')[1]) - 1, parseInt(dataStr.split('/')[0]))
      this.formVigencia.controls.frmFinVigencia.reset()
      this.formVigencia.controls.frmFinVigencia.markAllAsTouched()
    })
    this.datosService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data) =>{
      // console.log(data);
      this.opciones = data.data;
      if (this.data.type == 2) {
        this.formNewContrato.controls.frmSelectDoc.setValue('1');
        this.formNewContrato.controls.frmDoc.setValue(this.data.dataTallerista.nroDoc);
        this.searchDataPersona(1)
      }
    });
  }

  actualizarDate(input: any, opt: number) {
    if (input) {
      switch (opt) {
        case 1:
          this.formVigencia.controls.frmInicioVigencia.setValue(input)
          break;
        case 2:
          this.formVigencia.controls.frmFinVigencia.setValue(input)
          break;
      }
    }
  }

  onClose(){
    this._dialogRef.close();
  }

  onChangeFile(files: any) {
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/pdf\/*/) == null) {
      this.notificationService.warning(
        'Por favor seleccione un archivo PDF'
      );
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
      const fileApp = files[0];
      this.applicationFile = files[0];
      if (fileApp.size >= 1048576){
        this.notificationService.warning('Tamaño de archivo excedido, máximo 1MB');
        return;
      }
      else{
        }
      this.nombrePdf = files[0].name;
      this.retrievedPdf = reader.result;
      this.isPdfUpdate = true;
      };
  }
  removePdf() {
    this.applicationFile = null;
    this.nombrePdf = null;
    this.retrievedPdf = null;
    this.isPdfUpdate = false;
  }

  searchDataPersona(opt: number){
    if (opt == 1) {
      this.contratosService.searchForPerson({tipoDoc: this.formNewContrato.controls.frmSelectDoc.value!, numDoc: this.formNewContrato.controls.frmDoc.value!}).subscribe((data)=>{
        if (data.code == 0) {
          this.talleristaInfo = data.data;
          if (!this.talleristaInfo.acreditado) {
            this.formVigencia.controls.frmInicioVigencia.setValue(formatDate(this.talleristaInfo.contratoVigente[0].fechaInicio, 'd/M/yyyy', this.locale))
            this.formVigencia.controls.frmFinVigencia.setValue(formatDate(this.talleristaInfo.contratoVigente[0].fechaFin, 'd/M/yyyy', this.locale))
            this.formDataOrden.controls.frmOrden.setValue(this.talleristaInfo.contratoVigente[0].numOC)
            this.formDataOrden.controls.frmEntregables.setValue(this.talleristaInfo.contratoVigente[0].nroEntregables)
            this.formDataOrden.controls.frmMonto.setValue(this.talleristaInfo.contratoVigente[0].monto)
            if (this.data.type == 1) {
              this.formVigencia.disable()
              this.formDataOrden.disable()
            }
            else{
              this.formDataOrden.controls.frmOrden.disable();
              this.comprobacionPDF = this.talleristaInfo.contratoVigente[0].nombreFile;
            }
            if (this.talleristaInfo.contratoVigente[0].nombreFile || this.talleristaInfo.contratoVigente[0].sizeFile) {
              this.nombrePdf = this.talleristaInfo.contratoVigente[0].nombreFile;
              this.fileSize = this.talleristaInfo.contratoVigente[0].sizeFile;
              this.isPdfUpdate = true;
            }
            else{
              if (this.data.type == 1) {
                this.bloquearPDFAusente = true;
              }
            }
          }
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
      this.formDataOrden.reset();
      this.bloquearPDFAusente = false;
      this.formVigencia.reset();
      this.removePdf();
      this.talleristaInfo = null;
    }
  }

  generateContract(){
    if (this.talleristaInfo.acreditado) {
      if (this.talleristaInfo && this.formVigencia.valid && this.formDataOrden.valid) {
        this.status = 'loading';
        this.contratosService.saveDataContrato(this.getCabeceraPayload()).subscribe((data)=>{
          if (data.code == 0) {
            if (this.applicationFile) {
              const formData = new FormData();
              formData.append('numOc', this.formDataOrden.controls.frmOrden.value!)
              formData.append('archivoPdf', this.applicationFile);
              this.contratosService.saveFileOc(formData).subscribe((datos)=>{
                if (datos.code == 0) {
                  this.router.navigate([`app/${AppRoute.CONTRATOS}/${AppRoute.CONTRATOS_ASIGNAR_SERVICIOS}/${data.data.numOc}`])
                  this._dialogRef.close();
                  this.status = 'success';
                } 
                else {
                  this.status = 'failed';
                  this.notificationService.warning(datos.message);
                }
              })
            }
            else{
              this.router.navigate([`app/${AppRoute.CONTRATOS}/${AppRoute.CONTRATOS_ASIGNAR_SERVICIOS}/${data.data.numOc}`])
              this._dialogRef.close();
              this.status = 'success';
            }
          } 
          else {
            this.status = 'failed';
            this.notificationService.warning(data.message);
          }
        })
      }
      else{
        this.formDataOrden.markAllAsTouched();
        this.formVigencia.markAllAsTouched();
      }
    }
    else{
      this._dialogRef.close();
      this.router.navigate([`app/${AppRoute.CONTRATOS}/${AppRoute.CONTRATOS_ASIGNAR_SERVICIOS}/${this.talleristaInfo.contratoVigente[0].numOC}`])
    }
  }

  actualizarCabecera(){
    if (this.talleristaInfo && this.formVigencia.valid && this.formDataOrden.valid) {
      this.status = 'loading';
      this.contratosService.editCabeceraContrato(this.getEditCabecera()).subscribe((data)=>{
        if (data.code == 0){
          const formData = new FormData();
          formData.append('numOc', this.formDataOrden.controls.frmOrden.value!)
          formData.append('archivoPdf', this.applicationFile);
          this.contratosService.saveFileOc(formData).subscribe((datos)=>{
            if (datos.code == 0) {
              this.status = 'success';
              this.notificationService.success('Se editaron los datos de la cabecera del contrato');
              this._dialogRef.close(1);
            } 
            else {
              this.status = 'failed';
              this.notificationService.warning(datos.message);
            }
          })
        }
        else {
          this.status = 'failed';
          this.notificationService.warning(data.message);
        }
      })
    }
  }

  getEditCabecera(): RequestEditCabecera{
    let fechaInicio: string, fechaFin: string;
    fechaInicio = this.formVigencia.value.frmInicioVigencia!;
    fechaFin = this.formVigencia.value.frmFinVigencia!;

    return {
      idUsuarioTallerista: this.talleristaInfo.idUsuario,
      numOc: this.formDataOrden.controls.frmOrden.value!,
      fechaInicio: formatDate(fechaInicio!.split('/')[2] + '/' + fechaInicio!.split('/')[1] + '/' + fechaInicio!.split('/')[0], 'yyyy-MM-dd', this.locale),
      fechaFin: formatDate(fechaFin!.split('/')[2] + '/' + fechaFin!.split('/')[1] + '/' + fechaFin!.split('/')[0], 'yyyy-MM-dd', this.locale),
      nroEntregables: this.formDataOrden.controls.frmEntregables.value!,
      monto: this.formDataOrden.controls.frmMonto.value!,
      usuarioModId: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario
    }
  }

  getCabeceraPayload(): RequestSendCabeceraContrato{
    let fechaInicio: string, fechaFin: string;
    fechaInicio = this.formVigencia.value.frmInicioVigencia!;
    fechaFin = this.formVigencia.value.frmFinVigencia!;
    
    return {
      cabecera: {
        tipoOrigen: 'DESDE_RED',
        idUnidadOperativa: this.data.idUnid,
        idUsuarioTallerista: this.talleristaInfo.idUsuario,
        numOc: this.formDataOrden.controls.frmOrden.value!,
        fechaInicio: formatDate(fechaInicio!.split('/')[2] + '/' + fechaInicio!.split('/')[1] + '/' + fechaInicio!.split('/')[0], 'yyyy-MM-dd', this.locale),
        fechaFin: formatDate(fechaFin!.split('/')[2] + '/' + fechaFin!.split('/')[1] + '/' + fechaFin!.split('/')[0], 'yyyy-MM-dd', this.locale),
        nroEntregables: this.formDataOrden.controls.frmEntregables.value!,
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
