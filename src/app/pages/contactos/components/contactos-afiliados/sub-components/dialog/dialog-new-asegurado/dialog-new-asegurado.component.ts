import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AcreditarFichaPostulante } from '@models/admision/datos-persona.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'esp-dialog-new-asegurado',
  templateUrl: './dialog-new-asegurado.component.html',
  styleUrls: ['./dialog-new-asegurado.component.scss']
})
export class DialogNewAseguradoComponent {
  
  opciones: Parametro[] = [];
  
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
      const tipoDoc=this.formNewFicha.value.frmSelectDoc!;
      const numDoc=this.formNewFicha.value.frmDoc
      const unidadOpera = this.unidOpeUserSession.idUnidOperativa
      console.log("data de respuesta",this.unidOpeUserSession.idUnidOperativa)
      this.datosService.validarAdmisionIngreso(tipoDoc,numDoc!,unidadOpera, 1)
      .subscribe((data) => {
      console.log("data de respuesta",data.data.acreditado)
      if(data.code == 0){
      this.tipoMsg = data.data.acreditado;
      this.msgRespuesta = data.data.mensaje;
      //this.hayMsg = true;
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
