import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AdmisionFichaService } from '@services/admision/admision-ficha.service';
import { Parametro } from '@models/parametros-busqueda.model';
import { AcompanianteData } from '@models/admision/ficha-datos-adicionales.model';
import { DatosGeneralesService } from '@services/datos-generales.service';

@Component({
  selector: 'esp-dialog-data-acompaniante',
  templateUrl: './dialog-data-acompaniante.component.html',
  styleUrls: ['./dialog-data-acompaniante.component.scss']
})
export class DialogDataAcompanianteComponent {

  opcionesDocumento: Parametro[] = [];

  opcionesRelacion: Parametro[] = [];

  public formApoyo = this.fb.nonNullable.group({
    frmSelectParentesco:['', [Validators.required]],
    frmSelectDoc:['', [Validators.required]],
    frmDoc:['', [Validators.required, Validators.minLength(8)]],
    frmNombres:['', [Validators.required]],
    frmApellidos:['', [Validators.required]],
    frmTelefono:['', [Validators.required]],
    frmCorreo:['', [Validators.required,Validators.email]],
    frmWsp:['', [Validators.required]],
    frmCelular:['', [Validators.required]]
  });
  
  constructor(@Inject(DIALOG_DATA) public data: AcompanianteData,
              private datosService: DatosGeneralesService,
              private fb:FormBuilder,
              private _dialogRef:DialogRef<AcompanianteData>,) {

  }

  ngOnInit(): void {
    this.cargaServiciosParametros();
    this.formApoyo.controls.frmTelefono.valueChanges.subscribe(val => {
      this.formApoyo.controls.frmTelefono.setValue(val.trim(), { emitEvent: false })
    })
    this.formApoyo.controls.frmCelular.valueChanges.subscribe(val => {
      this.formApoyo.controls.frmCelular.setValue(val.trim(), { emitEvent: false })
    })

  }
  cargaServiciosParametros(){
    this.datosService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data) =>{
      this.opcionesDocumento = data.data;
    })
    this.datosService.getTipoParametros('PARENTESCO').subscribe((data)=>{
      this.opcionesRelacion = data.data;
    })
  }

  onClose(){
    this._dialogRef.close();
  }
  onSave(){
    console.log(this.formApoyo.value);
    if (this.formApoyo.valid) {
      this.data.siEnvia = true;
      this.data.parentesco = this.formApoyo.value.frmSelectParentesco!;
      this.data.tipoDoc = this.formApoyo.value.frmSelectDoc!;
      this.data.nroDoc = this.formApoyo.value.frmDoc!;
      this.data.nombres = this.formApoyo.value.frmNombres!;
      this.data.apellidos = this.formApoyo.value.frmApellidos!;
      this.data.telefono = this.formApoyo.value.frmTelefono!;
      this.data.correo = this.formApoyo.value.frmCorreo!;
      this.data.celular = this.formApoyo.value.frmCelular!;
      this.data.wsp = this.formApoyo.value.frmWsp!;
      this._dialogRef.close(this.data);
    }
    else{
      this.formApoyo.markAllAsTouched();
    }
  }
  print(obj: any){
    console.log(obj);
  }
}
