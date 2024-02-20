import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AcreditarFichaPostulante } from '@models/admision/datos-persona.model';
import { dataRequest } from '@models/admision/ficha-admision.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { AdmisionFichaService } from '@services/admision/admision-ficha.service';
import { BreadcrumService } from '@services/breadcrum.service';
import { DatosGeneralesService } from '@services/datos-generales.service';

@Component({
  selector: 'esp-new-ficha-admision',
  templateUrl: './new-ficha-admision.component.html',
  styleUrls: ['./new-ficha-admision.component.scss']
})
export class NewFichaAdmisionComponent {

  opciones: Parametro[] = [];

  modeloRequest: any;

  datosRouter!: {nameLink: string, codigo: string, tipo: string };

  hayMsg: boolean = false;
  tipoMsg: boolean = false;
  msgRespuesta: string = '';

  public formNewFicha = this.fb.nonNullable.group({
    frmSelectDoc:new FormControl(""),
    frmDoc:['', [Validators.required, Validators.minLength(8)]],
    frmBirthday:['']
  });

  unidOpeUserSession: any;
  
  constructor(private fb:FormBuilder,
              private _AdmisionFichaService: AdmisionFichaService,
              private router: Router,
              private breadcrumService: BreadcrumService,
              private datosService: DatosGeneralesService,
              private _dialogRef:DialogRef<NewFichaAdmisionComponent>,
              private dialog : Dialog) {

  }
  ngOnInit(){
    if(localStorage.getItem('UnidElegida') != 'null'){
      this.unidOpeUserSession = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;
    }
    else{
      this.unidOpeUserSession = '1';
    }

    this.datosService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data) =>{
      this.opciones = data.data;
    });
  }
  onClose(){
    this._dialogRef.close();
  }
  onSearch(){
    if(this.formNewFicha.valid){
      this._AdmisionFichaService.validarAdmisionIngreso(this.createRequest())
      .subscribe((data) => {
        console.log(this.createRequest())
        if(data.code == 0){
          this.tipoMsg = data.data.acreditado;
          this.msgRespuesta = data.data.mensaje;
          this.hayMsg = true;
        }
      });
    }
  }

  createRequest(): AcreditarFichaPostulante{
    return {
      idUnidadOpe: this.unidOpeUserSession,
      tipoDoc: this.formNewFicha.value.frmSelectDoc!,
      numDoc: this.formNewFicha.value.frmDoc!
    }
  }
  setLink2(codigo:string, tipo:string){
      this.router.navigate(['/app/admission/postulacion/', tipo, codigo]);
      this._dialogRef.close();
  }
}

