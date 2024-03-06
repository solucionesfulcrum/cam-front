import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { AfiliadosComponent } from '../afiliados/afiliados.component';
import { EvaluacionComponent } from '../evaluacion/evaluacion.component';
import { Dialog } from '@angular/cdk/dialog';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { direccionFichaFront } from '@models/afiliados/ficha-solicitud.model';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { Parametro } from '@models/parametros-busqueda.model';
import { DialogNotasComponent } from './dialog-notas/dialog-notas.component';

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
  idSolicitud: string = '';
  dataSolicitud: any;
  idUnidadOperativaUser = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;
  listParamDocumento: Parametro[] = [];
  parametroDocumento!: Parametro;
  direccionSolicitud: any = Object();
  
  ready: boolean = false;

  edadPersona: number = 0;

  direcciones: direccionFichaFront[] = [];

  formContacto = this.fb.nonNullable.group({
    frmTelefono:[''],
    frmCelular:[''],
    frmWsp: [null],
    frmCorreo:[''],
  });
  //-----

  constructor(private router: Router,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private notificationService      : ToastrService,
    private datosGeneralesServices        : DatosGeneralesService,
    private dialog : Dialog,
    private _afiliaddoService: AfiliacionesSolicitudesService ) {
      this.idSolicitud = this.activeRoute.snapshot.paramMap.get('idSolicitud')!;
  }

  ngOnInit(): void {
    this._afiliaddoService.getDataSolicitud(this.idSolicitud).subscribe((data)=>{
      if (data.code == 0) {
        console.log(data.data);
        this.dataSolicitud = data.data;
        var dateObject = new Date(data.data.asegurado.fecNacimiento); 
        var timeDiff = Math.abs(Date.now() - dateObject.getTime());
        this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);

        this.getParametros();

        this.formContacto = this.fb.nonNullable.group({
          frmTelefono:[{value: data.data.fichaAdmision.datosContacto.telefono, disabled:true}],
          frmCelular:[{value: data.data.fichaAdmision.datosContacto.celular, disabled:true}],
          frmWsp:[{value: data.data.fichaAdmision.datosContacto.tieneWhatsapp, disabled:true}],
          frmCorreo:[{value: data.data.fichaAdmision.datosContacto.correo, disabled:true}],
        });
  
        this.getDireccionDatos();
        
      }
      else{
        this.notificationService.warning(data.message)
      }
    })
  }

  getParametros(){
    this.datosGeneralesServices.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data)=>{
      this.listParamDocumento = data.data;
      this.parametroDocumento = data.data.find((x) => x.valor1 == this.dataSolicitud.asegurado.tipoDoc)!;

      this.ready = true;
    })
  }

  getDireccionDatos(){
    this.dataSolicitud.fichaAdmision.direccion.map((dir: any) =>{
      let direccion: direccionFichaFront = Object();
      this.datosGeneralesServices.getTipoParametros('TIPO_DIRECCION').subscribe((data)=>{
        direccion.nomParametro = data.data.find((x: any)=>{return x.idParametros == dir.paramTipoId})!.nombre;
      })
      this.datosGeneralesServices.searchByUbigeo(dir.codUbiDep + dir.codUbiProv + dir.codUbiDist).subscribe((dataUbicacion)=>{
        if (dataUbicacion.code == 0) {
          if (dir.activo == 1) {
            direccion.nomDep = dataUbicacion.data.region;
            direccion.nomProv = dataUbicacion.data.provincia;
            direccion.nomDist = dataUbicacion.data.distrito;
            direccion.paramTipoId = dir.paramTipoId;
            direccion.direccion = dir.direccion;
            direccion.pisoNumDep = dir.pisoNumDep;
            direccion.codDep = dir.codUbiDep.trim();
            direccion.codProv = dir.codUbiProv.trim();
            direccion.codDist = dir.codUbiDist.trim();
            direccion.activo = dir.activo;
            this.direcciones.push(direccion);
          }
        }
        else{
          this.notificationService.warning(dataUbicacion.message);
        }
      })
    })

    this.datosGeneralesServices.searchByUbigeo(this.dataSolicitud.solicitud.ubigeoDireccion).subscribe((data)=>{
      if (data.code == 0) {
        this.direccionSolicitud = data.data;
        console.log(this.direccionSolicitud)
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  EvalAfiliado(){
    this.opcionesBotones[1].loading = true;
    this.datosGeneralesServices.validarAdmisionIngreso(this.dataSolicitud.asegurado.tipoDoc, this.dataSolicitud.asegurado.numDoc, this.idUnidadOperativaUser, 2).subscribe((data)=>{
      if (data.code == 0) {
        this.opcionesBotones[1].loading = false;
        if (data.data.acreditado) {
          localStorage.setItem('idFichaEvaluada', this.dataSolicitud.fichaAdmision.idFichaAdmision);
          this.router.navigate(['/app/afiliados/evaluacion/agregaEval'])
        }
        else{
          this.notificationService.warning(data.data.mensaje);
        }
      }
      else{
        this.opcionesBotones[1].loading = false;
        this.notificationService.warning(data.message);
      }
    });


  }

  Notas(){
    const dialogRef = this.dialog.open(DialogNotasComponent,{
      minWidth:'800px',
      maxWidth:'50%',        
      data:{
        idSolicitud: this.idSolicitud,
      }
    })
    dialogRef.closed.subscribe(out =>{
      // console.log(out)
    })
  }

  
}