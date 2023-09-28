import { Component} from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, Route, RouterLink, ActivatedRoute } from '@angular/router';
import { dataRequest } from '@models/ficha-solicitud.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { AfiliadoService } from '@shared/services/afiliado.service';
import { BreadcrumService } from '@shared/services/breadcrum.service';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css']
})
export class EvaluacionComponent {
  
  opciones: Parametro[] = [];

  modeloRequest: any;

  seEncontro: boolean = false;
  msgEncontro: string = '';

  datosRouter!: {nameLink: string, codigo: string, tipo: string };

  hayError: boolean = false;
  msgError: string = '';

  public formNewFicha = this.fb.nonNullable.group({
     frmSelectDoc:new FormControl(""),
     frmDoc:['', [Validators.required, Validators.minLength(8)]],
     frmBirthday:['']
  });

  constructor(private fb:FormBuilder,
     private _afiliadoService: AfiliadoService,
     private router: Router, 
     private route: ActivatedRoute,     
     private breadcrumService: BreadcrumService) { }

  ngOnInit(): void {
     this._afiliadoService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data) =>{
       this.opciones = data.data;
     });
  }

  onClose(){
     
   }


  onSearch(){
     this.hayError = false;
     this.seEncontro = false;
     if(this.formNewFicha.valid){
       this._afiliadoService.searchAndFindData(this.createRequest())
       .subscribe((data) => {
         console.log(data);
         if(data.code == 0){
           this.seEncontro = true;
           const dataObj = Object(data);
           this.msgEncontro = dataObj.data.dataPersona.txtNombres +
           ' ' + dataObj.data.dataPersona.txtApepaterno +
           ' ' +  dataObj.data.dataPersona.txtApematerno +
           ' con DNI ' + this.createRequest().numDoc +
           ' cumple con los requisitos del programa'
         }
         else{
           this.hayError = true;
           this.msgError = data.message;
           console.log(this.msgError);
         }
       });
     }
   }
   createRequest(): dataRequest{
     return {
       codOpcion: '1',
       tipoDoc: this.formNewFicha.value.frmSelectDoc!,
       numDoc: this.formNewFicha.value.frmDoc!
     }
   }
       setLink2(codigo:string, tipo:string){
         this.router.navigate(['app/admission/postulacion/', codigo, tipo]);
   }

}

