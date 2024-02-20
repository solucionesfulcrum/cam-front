import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AfiliadosComponent } from '../../afiliados/afiliados.component';
import { EvaluacionComponent } from '../../evaluacion/evaluacion.component';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { NotasAfilComponent } from '../notas-afil/notas-afil.component';
import { AfiliadoService } from 'src/app/data/services/afiliaciones/afiliado.service';

@Component({
  selector: 'app-new-eval2-afiliado',
  templateUrl: './new-eval2-afiliado.component.html',
  styleUrls: ['./new-eval2-afiliado.component.css']
})
export class NewEval2AfiliadoComponent implements OnInit {

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

  onAnterior() {
    this.router.navigate(['/afiliados/agregaEval'])
  }

  onNext(){
     
    this.router.navigate(['/afiliados/agregaEval3'])
  }
}


