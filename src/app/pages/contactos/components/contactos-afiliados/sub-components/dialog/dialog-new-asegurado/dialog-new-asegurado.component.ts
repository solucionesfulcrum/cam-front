import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Parametro } from '@models/parametros-busqueda.model';
import { DatosGeneralesService } from '@services/datos-generales.service';

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
      // this._AdmisionFichaService.validarAdmisionIngreso(this.createRequest())
      // .subscribe((data) => {
      //   console.log(this.createRequest())
      //   if(data.code == 0){
      //     this.tipoMsg = data.data.acreditado;
      //     this.msgRespuesta = data.data.mensaje;
      //     this.hayMsg = true;
      //   }
      // });
    }
  }
}
