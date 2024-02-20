import { Component } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Parametro } from '@models/parametros-busqueda.model';
import { Title } from '@angular/platform-browser';
import { dataRequest } from '@models/afiliados/ficha-solicitud.model';
import { AfiliadoService } from 'src/app/data/services/afiliaciones/afiliado.service';

@Component({
  selector: 'app-notas-afil',
  templateUrl: './notas-afil.component.html',
  styleUrls: ['./notas-afil.component.css']
})

export class NotasAfilComponent {

  formNewFicha: FormGroup;
  textoIngresado: string = ''; 
  

  // opciones: Parametro[] = [];
  // modeloRequest: any;
  // seEncontro: boolean = false;
  // msgEncontro: string = '';
  // datosRouter!: {nameLink: string, codigo: string, tipo: string };
  // hayError: boolean = false;
  // msgError: string = '';
  // public formNewFicha = this.fb.nonNullable.group({
  //   frmSelectDoc:new FormControl(""),
  //   frmDoc:['', [Validators.required, Validators.minLength(8)]],
  //   frmBirthday:['']
  // });


  constructor(private fb:FormBuilder,
    private _afiliadoService: AfiliadoService,
    private router: Router,
    private _dialogRef:DialogRef<NotasAfilComponent>,
    private dialog : Dialog) { 

      this.formNewFicha = this.fb.group({
        frmDoc: ['', Validators.maxLength(800)] // Agrega validador de longitud máxima
      });

    }

  ngOnInit(): void {
    // this._afiliadoService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data) =>{
    //   this.opciones = data.data;
    // });    
  }

  onClose(){
    this._dialogRef.close();
  }

  onAgregar(){

    this.textoIngresado = this.formNewFicha.get('frmDoc')?.value; 
    // this.hayError = false;
    // this.seEncontro = false;
    // if(this.formNewFicha.valid){
    //   this._afiliadoService.searchAndFindData(this.createRequest())
    //   .subscribe((data) => {
    //     console.log(data);
    //     if(data.code == 0){
    //       this.seEncontro = true;
    //       const dataObj = Object(data);
    //       this.msgEncontro = dataObj.data.dataPersona.txtNombres +
    //       ' ' + dataObj.data.dataPersona.txtApepaterno +
    //       ' ' +  dataObj.data.dataPersona.txtApematerno +
    //       ' con DNI ' + this.createRequest().numDoc +
    //       ' cumple con los requisitos del programa'
    //     }
    //     else{
    //       this.hayError = true;
    //       this.msgError = data.message;
    //       console.log(this.msgError);
    //     }
    //   });
    // }
  }

  createRequest(): dataRequest{
    return {
      codOpcion: '1',
      tipoDoc: this.formNewFicha.value.frmSelectDoc!,
      numDoc: this.formNewFicha.value.frmDoc!
    }
  }

  setLink2(codigo:string, tipo:string){
      this.router.navigate(['/afiliados/solicitudes/', tipo, codigo]);
      this._dialogRef.close();
  }


}


