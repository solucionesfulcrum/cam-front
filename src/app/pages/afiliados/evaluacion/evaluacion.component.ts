import { Component} from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, Route, RouterLink, ActivatedRoute } from '@angular/router';
import { dataRequest } from '@models/afiliados/ficha-solicitud.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { AfiliadoService } from 'src/app/data/services/afiliaciones/afiliado.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css']
})
export class EvaluacionComponent {
  
  opciones: Parametro[] = [];
  dataUnidadElegida: any = Object();
  infoObtenida: any = Object();
  status: RequestStatus = 'init';

  modeloRequest: any;

  seEncontro: boolean = false;
  msgEncontro: string = '';

  datosRouter!: {nameLink: string, codigo: string, tipo: string };

  hayError: boolean = false;
  msgError: string = '';

  public formNewFicha = this.fb.nonNullable.group({
     frmSelectDoc:new FormControl(""),
     frmDoc:['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(private fb:FormBuilder,
     private datosGeneralesService: DatosGeneralesService,
     private notificationService: NotificationService,
     private router: Router, 
     private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.dataUnidadElegida = JSON.parse(localStorage.getItem('UnidElegida')!);
    this.datosGeneralesService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data) =>{
      if (data.code == 0) {
        this.opciones = data.data;
      }
      else{
        this.notificationService.warning(data.message);
      }
    });
  }

  onClose(){
     
  }

  onSearch(){
    if(this.formNewFicha.valid){
      this.status = 'loading';
      this.datosGeneralesService.validarAdmisionIngreso(this.formNewFicha.value.frmSelectDoc!, this.formNewFicha.value.frmDoc!, this.dataUnidadElegida.idUnidOperativa, 2).subscribe((data)=>{
        if (data.code == 0) {
          this.infoObtenida = data.data;
          if (this.infoObtenida.acreditado) {
            this.status = 'success';
            localStorage.setItem('idFichaEvaluada', this.infoObtenida.idFichaAdmision);
            this.router.navigate(['app/afiliados/evaluacion/agregaEval']);
            // console.log(data.data)
          }
          else{
            this.status = 'failed';
          }
        }
        else{
          this.notificationService.warning(data.message);
        }
      })
    }else{
      this.formNewFicha.markAllAsTouched();
    }
  }

  // onSearch(){
  //    this.hayError = false;
  //    this.seEncontro = false;
  //    if(this.formNewFicha.valid){
  //      this._afiliadoService.searchAndFindData(this.createRequest())
  //      .subscribe((data) => {
  //        console.log(data);
  //        if(data.code == 0){
  //          this.seEncontro = true;
  //          const dataObj = Object(data);
  //          this.msgEncontro = dataObj.data.dataPersona.txtNombres +
  //          ' ' + dataObj.data.dataPersona.txtApepaterno +
  //          ' ' +  dataObj.data.dataPersona.txtApematerno +
  //          ' con DNI ' + this.createRequest().numDoc +
  //          ' cumple con los requisitos del programa'
  //        }
  //        else{
  //          this.hayError = true;
  //          this.msgError = data.message;
  //          console.log(this.msgError);
  //        }
  //      });
  //    }
  //  }
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

