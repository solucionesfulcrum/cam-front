import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AfiliadoService } from '@shared/services/afiliado.service';
import { AfiliadosComponent } from '../../afiliados/afiliados.component';
import { EvaluacionComponent } from '../../evaluacion/evaluacion.component';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { NotasAfilComponent } from '../notas-afil/notas-afil.component';


@Component({
  selector: 'app-new-eval-afiliado',
  templateUrl: './new-eval-afiliado.component.html',
  styleUrls: ['./new-eval-afiliado.component.css']
})
export class NewEvalAfiliadoComponent implements OnInit {
  
  show= false;
  dataFicha: any = [''];
  dataAsegurado: any = [''];
  idFicha: string;

  edadPersona: number = 0;
  selectSi = false;
  selectNo = false;

  constructor (private router: Router, 
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog : Dialog,
    private _afiliaddoService: AfiliadoService ) {
    this.idFicha=this.activeRoute.snapshot.paramMap.get('id')!;  }

  ngOnInit(): void {
    this._afiliaddoService.getFicha(this.idFicha).subscribe((data : any)=>{
      const dataObj = Object(data);
      this.dataFicha = dataObj.data;
      this.dataAsegurado = dataObj.data.asegurado
      //Obtener datos de direccion reniec
      var dateParts = this.dataAsegurado.fecNacimiento.split("-");
      var dateObject = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[1]); 
      var timeDiff = Math.abs(Date.now() - dateObject.getTime());
      this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);


      // this.formContacto = this.fb.nonNullable.group({
      //   frmTelefono:[{value: dataObj.data.asegurado.telefRefer, disabled:true}],
      //   frmCelular:[{value: dataObj.data.asegurado.telefWhatsapp, disabled:true}],
      //   frmCorreo:[{value: dataObj.data.asegurado.correoRefer, disabled:true}],
      //   frmObservacion:[{value: dataObj.data.observacion, disabled:true}]
      // });

      // if(dataObj.data.asegurado.tieneAcomp === 'SI'){
      //   this.selectSi = true;
      //   this.requiereApoyo = true;
      //   this._afiliaddoService.getTipoParametros('PARENTESCO').subscribe((data)=>{
      //     this.parentesco = data.data.find((x)=> x.idParametros == dataObj.data.asegurado.codParentAcomp)?.nombre!;
      //   })
      //   this._afiliaddoService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data)=>{
      //     this.tipoDocAcomp = data.data.find((x)=> x.valor1 == dataObj.data.asegurado.tipDocIdentAcomp)?.nombre!;
      //   })
      // }
      // else{
      //   this.selectNo = true;
      // }

      console.log(data);
    });

  }
  Imprimir(){
    window.print()
  }

  GuardarEval(){
  
  }

  Notas(){
    const dialogRef = this.dialog.open(NotasAfilComponent,{
      minWidth:'800px',
      maxWidth:'50%',        
      data:{}
    })
    dialogRef.closed.subscribe(out =>{
      // console.log(out)
    })
  }

  onClose() {
    this.router.navigate(['/afiliados/solicitudes/show/:id'])
  }

  onNext(){
     
    this.router.navigate(['/afiliados/agregaEval2'])
  }
}

