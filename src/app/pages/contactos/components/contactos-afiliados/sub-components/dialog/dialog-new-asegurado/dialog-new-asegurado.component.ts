import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AcreditarFichaPostulante } from '@models/admision/datos-persona.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'esp-dialog-new-asegurado',
  templateUrl: './dialog-new-asegurado.component.html',
  styleUrls: ['./dialog-new-asegurado.component.scss']
})
export class DialogNewAseguradoComponent {
  
  opciones: Parametro[] = [];
  status: RequestStatus = 'init';
  
  public formNewFicha = this.fb.nonNullable.group({
    frmSelectDoc:new FormControl(""),
    frmDoc:['', [Validators.required, Validators.minLength(8)]],
  });

  unidOpeUserSession: any; 
  tipoMsg: any;
  msgRespuesta: any;
  constructor(private fb                                  : FormBuilder,
              private router                              : Router,
              private datosService                        : DatosGeneralesService,
              private notificationService                 : NotificationService,
              private _dialogRef                          : DialogRef<DialogNewAseguradoComponent>) {

  }

  ngOnInit(){
    if(localStorage.getItem('UnidElegida') != 'null'){
      this.unidOpeUserSession = (JSON.parse(localStorage.getItem('UnidElegida')!));
    }
    else{
    this.unidOpeUserSession = '1';
    }

    this.datosService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data) =>{
      console.log(data);
      this.opciones = data.data;
    });
  }

  onClose(){
    this._dialogRef.close();
  }
  onSearch(){
    if(this.formNewFicha.valid){
      this.status = 'loading';
      const tipoDoc=this.formNewFicha.value.frmSelectDoc!;
      const numDoc=this.formNewFicha.value.frmDoc
      const unidadOpera = this.unidOpeUserSession.idUnidOperativa
      console.log("data de respuesta",this.unidOpeUserSession.idUnidOperativa)
      this.datosService.validarAdmisionIngreso(tipoDoc,numDoc!,unidadOpera, 1)
      .subscribe((data) => {
        console.log("data de respuesta",data.data.acreditado)
        if(data.code == 0){
          this.status = 'success';
          this.tipoMsg = data.data.acreditado;
          this.msgRespuesta = data.data.mensaje;
          if (this.tipoMsg == true) {
            this.setLink2(this.createRequest().numDoc, this.createRequest().tipoDoc)
          }
          //this.hayMsg = true;
        }
        else{
          this.status = 'failed';
          this.notificationService.warning(data.message);
        }
      });
    }else{
      
    }
  }
  createRequest(): AcreditarFichaPostulante{
    return {
      idUnidadOpe: this.unidOpeUserSession.idUnidOperativa,
      tipoDoc: this.formNewFicha.value.frmSelectDoc!,
      numDoc: this.formNewFicha.value.frmDoc!
    }
  }
  setLink2(codigo:string, tipo:string){
    this.router.navigate(['/app/afiliados/register/', tipo, codigo]);
    this._dialogRef.close();
}
}
