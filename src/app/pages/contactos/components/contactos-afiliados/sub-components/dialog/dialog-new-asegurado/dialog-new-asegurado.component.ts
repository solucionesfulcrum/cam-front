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

  tipoDocMap : any = {
    "4": "2",
    "1": "1"
  }
  
  public formNewFicha = this.fb.nonNullable.group({
    frmSelectDoc:new FormControl("1"),
    frmDoc:['', [Validators.required, Validators.minLength(3)]],
    fechaNac:[''],
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
      // //console.log(data);
      this.opciones = data.data;
    });
  }

  onClose(){
    this._dialogRef.close();
  }
  onSearch(){
    if(this.formNewFicha.valid){
      this.status = 'loading';
      const tipoDoc= this.tipoDocMap[this.formNewFicha.value.frmSelectDoc!];
      const numDoc=this.formNewFicha.value.frmDoc
      const unidadOpera = this.unidOpeUserSession.idUnidOperativa
      // //console.log("data de respuesta",this.unidOpeUserSession.idUnidOperativa)
      if(true){
        this.datosService.validarAdmisionIngreso(tipoDoc,numDoc!,unidadOpera, 1, this.createRequest().fecNac!)
        .subscribe((data) => {
          // //console.log("data de respuesta",data.data.acreditado)
          if(data.code == 0){
            this.status = 'success';
            this.tipoMsg = data.data.acreditado;
            this.msgRespuesta = data.data.mensaje;
            if (this.tipoMsg == true) {
              this.setLink2(this.createRequest().numDoc, this.createRequest().tipoDoc , this.createRequest().fecNac!)
            }
            //this.hayMsg = true;
          }
          else{
            this.status = 'failed';
            this.notificationService.warning(data.message);
          }
        });
      }else{
        this.setLink2(this.createRequest().numDoc, this.createRequest().tipoDoc , this.createRequest().fecNac!)
      }
      }
      else{
        
      }
    
  }
  createRequest(): AcreditarFichaPostulante{
    let valFechaNacimiento = "";
    let fechaNacimiento =  this.formNewFicha.value.fechaNac;
    if(fechaNacimiento){
      let splitFechaNacimiento = fechaNacimiento?.split("-");
      let fechaNacimientoPayload = splitFechaNacimiento[2]+"/"+splitFechaNacimiento[1]+"/"+splitFechaNacimiento[0];
      valFechaNacimiento = fechaNacimientoPayload;
    }
    return {
      idUnidadOpe: this.unidOpeUserSession.idUnidOperativa,
      tipoDoc: this.tipoDocMap[this.formNewFicha.value.frmSelectDoc!],
      numDoc: this.formNewFicha.value.frmDoc!,
      fecNac: valFechaNacimiento
    }
  }
  setLink2(codigo:string, tipo:string, fecNac: string){
    this.router.navigate(['/app/afiliados/register/', tipo, codigo, fecNac]);
    this._dialogRef.close();
}
}
