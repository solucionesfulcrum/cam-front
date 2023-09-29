import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { AfiliadoService } from '@shared/services/afiliado.service';
import { AfiliadosComponent } from '../../afiliados/afiliados.component';
import { EvaluacionComponent } from '../../evaluacion/evaluacion.component';
import { NewEvalAfiliadoComponent } from '../../components/new-eval-afiliado/new-eval-afiliado.component';
import { Dialog } from '@angular/cdk/dialog';
import { NotasAfilComponent } from '../../components/notas-afil/notas-afil.component';


export interface direccionData {
  estadoEnvio?: number;
  nombreDireccion: string;
  direccion: string;
  piso: string;
  distrito: string;
  provincia: string;
  departamento: string;
}

@Component({
  selector: 'app-result-eval-afiliado',
  templateUrl: './result-eval-afiliado.component.html',
  styleUrls: ['./result-eval-afiliado.component.css']
})



export class ResultEvalAfiliadoComponent implements OnInit {

  show= false;
  dataFicha: any = [''];
  dataAsegurado: any = [''];
  idFicha: string;

  edadPersona: number = 0;
  selectSi = false;
  selectNo = false;
  requiereApoyo: boolean = false;
  parentesco: string = '';
  tipoDocAcomp: string = '';

  /*direcciones: direccionData[] = [{estadoEnvio:1, nombreDireccion: 'Datos RENIEC', direccion: '', piso: '', distrito: '', provincia: '', departamento: ''},
  {estadoEnvio:1, nombreDireccion: 'Casa', direccion: '', piso: '', distrito: '', provincia: '', departamento: ''}]; */

  direcciones: direccionData[] = [{estadoEnvio:1, nombreDireccion: 'Casa', direccion: '', piso: '', distrito: '', provincia: '', departamento: ''}];

  formContacto = this.fb.nonNullable.group({
    frmTelefono:[''],
    frmCelular:[''],
    frmCorreo:[''],
    frmObservacion:['']
  });
  //-----

  constructor(private router: Router,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog : Dialog,
    private _afiliaddoService: AfiliadoService ) {
    this.idFicha=this.activeRoute.snapshot.paramMap.get('id')!;
  }

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
/*      this.direcciones[0].direccion = dataObj.data.asegurado.direccionActual;
      this.direcciones[0].distrito = dataObj.data.asegurado.distriActual;
      this.direcciones[0].provincia = dataObj.data.asegurado.provinActual;
      this.direcciones[0].departamento = dataObj.data.asegurado.departActual;
      //Obtener datos de direccion casa
      this.direcciones[1].direccion = dataObj.data.asegurado.direccDomicilio;
      this.direcciones[1].distrito = dataObj.data.asegurado.distriDomicilio;
      this.direcciones[1].provincia = dataObj.data.asegurado.provinDomicilio;
      this.direcciones[1].departamento = dataObj.data.asegurado.departDomicilio;
*/
      //Obtener datos de direccion casa
      this.direcciones[0].direccion = dataObj.data.asegurado.direccDomicilio;
      this.direcciones[0].distrito = dataObj.data.asegurado.distriDomicilio;
      this.direcciones[0].provincia = dataObj.data.asegurado.provinDomicilio;
      this.direcciones[0].departamento = dataObj.data.asegurado.departDomicilio;

      this.formContacto = this.fb.nonNullable.group({
        frmTelefono:[{value: dataObj.data.asegurado.telefRefer, disabled:true}],
        frmCelular:[{value: dataObj.data.asegurado.telefWhatsapp, disabled:true}],
        frmCorreo:[{value: dataObj.data.asegurado.correoRefer, disabled:true}],
        frmObservacion:[{value: dataObj.data.observacion, disabled:true}]
      });

      if(dataObj.data.asegurado.tieneAcomp === 'SI'){
        this.selectSi = true;
        this.requiereApoyo = true;
        this._afiliaddoService.getTipoParametros('PARENTESCO').subscribe((data)=>{
          this.parentesco = data.data.find((x)=> x.idParametros == dataObj.data.asegurado.codParentAcomp)?.nombre!;
        })
        this._afiliaddoService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data)=>{
          this.tipoDocAcomp = data.data.find((x)=> x.valor1 == dataObj.data.asegurado.tipDocIdentAcomp)?.nombre!;
        })
      }
      else{
        this.selectNo = true;
      }

      console.log(data);
    });
  }
  Imprimir(){
    window.print()
  }

  EvalAfiliado(){
    
    this.router.navigate(['/afiliados/agregaEval'])

    // const dialogRef = this.dialog.open(NewEvalAfiliadoComponent,{
    //   minWidth:'800px',
    //   maxWidth:'50%',
    //   data:{}
    // })
    // dialogRef.closed.subscribe(out =>{
    //   // console.log(out)
    // })
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

}




