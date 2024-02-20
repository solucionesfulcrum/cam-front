import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { AfiliadosComponent } from '../afiliados/afiliados.component';
import { EvaluacionComponent } from '../evaluacion/evaluacion.component';
import { NewEvalAfiliadoComponent } from '../components/new-eval-afiliado/new-eval-afiliado.component';
import { Dialog } from '@angular/cdk/dialog';
import { NotasAfilComponent } from '../components/notas-afil/notas-afil.component';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { direccionFichaFront } from '@models/afiliados/ficha-solicitud.model';

@Component({
  selector: 'app-show-sol',
  templateUrl: './show-sol.component.html',
  styleUrls: ['./show-sol.component.css'],
  
})


export class ShowSolComponent implements OnInit {
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Notas', esImagen: true, rutaIcono: 'assets/svg/iconFileEdit.svg'},
    {texto: 'Evaluar Afiliado', colorBtn:'mezclado', loading: false},
  ];

  faSpinner = faSpinner;
  dataSolicitud: any;
  ready: boolean = false;

  show= false;
  dataFicha: any = [''];
  dataAsegurado: any = [''];
  tipoDoc: string;
  numDoc: string;

  edadPersona: number = 0;
  
  // selectSi = false;
  // selectNo = false;
  // requiereApoyo: boolean = false;
  // parentesco: string = '';
  // tipoDocAcomp: string = '';
    
  
  /*direcciones: direccionData[] = [{estadoEnvio:1, nombreDireccion: 'Datos RENIEC', direccion: '', piso: '', distrito: '', provincia: '', departamento: ''},
  {estadoEnvio:1, nombreDireccion: 'Casa', direccion: '', piso: '', distrito: '', provincia: '', departamento: ''}]; */

  direcciones: direccionFichaFront[] = [];

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
    private notificationService      : ToastrService,
    private dialog : Dialog,
    private _afiliaddoService: AfiliacionesSolicitudesService ) {
      this.tipoDoc = this.activeRoute.snapshot.paramMap.get('tipoDoc')!;
      this.numDoc = this.activeRoute.snapshot.paramMap.get('numDoc')!;
  }

  ngOnInit(): void {
    this._afiliaddoService.getDataSolicitud(this.tipoDoc, this.numDoc).subscribe((data)=>{
      if (data.message) {
        this.notificationService.warning(data.message)
      }
      else{
        console.log(data);
        this.dataSolicitud = data;
        this.formContacto.controls.frmCorreo.setValue(data.correo);
        this.formContacto.controls.frmCelular.setValue(data.celular);
        this.formContacto.controls.frmTelefono.setValue(data.telefono);
  
        var dateParts = data.fecNac.split("/");
        var dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]); 
        var timeDiff = Math.abs(Date.now() - dateObject.getTime());
        this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        
        this.direcciones.push({paramTipoId: 1, nomParametro: 'Casa', direccion: data.direccion, codDep: data.ubigeo.match(/.{1,2}/g)[0], codProv: data.ubigeo.match(/.{1,2}/g)[1], codDist: data.ubigeo.match(/.{1,2}/g)[2], nomDep: data.departamento, nomProv: data.provincia, nomDist: data.distrito, activo: 1,})

        this.ready = true;
      }
    })
  }
  Imprimir(){
    window.print()
  }

  EvalAfiliado(){
    
    this.router.navigate(['/app/afiliados/agregaEval'])

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