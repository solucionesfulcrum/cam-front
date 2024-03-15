import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { direccionFichaFront } from '@models/admision/ficha-datos-adicionales.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { RequestStatus } from '@models/request-status.model';
import { AdmisionFichaService } from '@services/admision/admision-ficha.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { map } from 'rxjs';

@Component({
  selector: 'esp-show-ficha-admision',
  templateUrl: './show-ficha-admision.component.html',
  styleUrls: ['./show-ficha-admision.component.scss']
})
export class ShowFichaAdmisionComponent {
  
  status: RequestStatus = 'init';
  
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Derivar', esImagen: true, rutaIcono: 'assets/svg/iconDerivar.svg'},
    {texto: 'Finalizar', esImagen: true, rutaIcono: 'assets/svg/iconFinalizar.svg', loading: false},
    {texto: 'Editar', esImagen: true, rutaIcono: 'assets/svg/iconFileEdit.svg'},
    {texto: 'Imprimir', colorBtn:'mezclado', loading: false},
  ]
  
  listParamDocumento: Parametro[] = [];
  listParamDirecciones: Parametro[] = [];
  listParamModIngr: Parametro[] = [];
  listParamRelacion: Parametro[] = [];

  modalidadElegida: Parametro = Object();
  
  faSpinner = faSpinner;
  wait = false;
  dataFicha: any = [''];
  dataAsegurado: any = [''];
  idFicha: string;

  edadPersona: number = 0;

  requiereApoyo: boolean = false;
  datosProcedenciaExtra: boolean = false;
  direccionesPersona: direccionFichaFront[] = [];
  selectProcedenciaDerivOtro = '';
  datoProcedenciaDerivOtro = '';

  direccionElegida: direccionFichaFront = Object();

  parentesco: string = '';
  tipoDocAcomp: string = '';
  
  blobContent: any;
  pdfUrl!: SafeUrl;

  formContacto = this.fb.nonNullable.group({
    frmTelefono:[''],
    frmCelular:[''],
    frmWsp:[''],
    frmCorreo:[''],
    frmObservacion:['']
  });


  constructor(private activeRoute: ActivatedRoute,
              private datosService: DatosGeneralesService,
              private router      : Router,
              private fb: FormBuilder,
              private sanitizer: DomSanitizer,
              private _admissionService: AdmisionFichaService) {
                this.idFicha = this.activeRoute.snapshot.paramMap.get('id')!;            
              }
  
  ngOnInit(): void {
    this.cargaServiciosParametros();
    this._admissionService.getFicha(this.idFicha).subscribe((data : any)=>{
      console.log(data)
      const dataObj = Object(data);
      this.dataFicha = dataObj.data.fichaAdmision;
      this.dataAsegurado = dataObj.data.asegurado
      //Obtener datos de direccion reniec
      var dateParts = this.dataAsegurado.fecNacimiento.split("-");
      var dateObject = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[1]); 
      var timeDiff = Math.abs(Date.now() - dateObject.getTime());
      this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);

      this.formContacto = this.fb.nonNullable.group({
        frmTelefono:[{value: this.dataFicha.datosContacto.telefono, disabled:true}],
        frmCelular:[{value: this.dataFicha.datosContacto.celular, disabled:true}],
        frmCorreo:[{value: this.dataFicha.datosContacto.correo, disabled:true}],
        frmWsp:[{value: this.dataFicha.datosContacto.tieneWhatsapp, disabled:true}],
        frmObservacion:[{value: this.dataFicha.observacion, disabled:true}]
      });
      
      this.getDireccionDatos(this.dataFicha.direccion)

      this.datosService.getTipoParametros('MOD_INGRESO_ADMISION').subscribe((data)=>{
        this.modalidadElegida = data.data.find((x)=>{
          return x.idParametros == this.dataFicha.datosProcedencia.paramModIngresoId
        })!;
      })

      if(this.dataFicha.datosProcedencia.paramModIngresoId == 5 || this.dataFicha.datosProcedencia.paramModIngresoId == 6 || this.dataFicha.datosProcedencia.paramModIngresoId == 1){
        this.datosProcedenciaExtra = true;
        switch (this.dataFicha.datosProcedencia.paramModIngresoId) {
          case 1: 
            this.selectProcedenciaDerivOtro = 'IPRESS';
            this.datoProcedenciaDerivOtro = this.dataFicha.datosProcedencia.modalidadIngreso.nomIpres;
            break;
          case 5:
            this.selectProcedenciaDerivOtro = 'CERPS';
            this.datoProcedenciaDerivOtro = this.dataFicha.datosProcedencia.modalidadIngreso.nomCerps;
            break;
          case 6:
            this.selectProcedenciaDerivOtro = 'MBRPS';
            this.datoProcedenciaDerivOtro = this.dataFicha.datosProcedencia.modalidadIngreso.nomMbrps;
            break;
        }
      }

      if(this.dataFicha.datosAcompaniante.requiereApoyo === 'SI'){
        this.requiereApoyo = true;
        this.datosService.getTipoParametros('PARENTESCO').subscribe((data)=>{
          this.parentesco = data.data.find((x)=> x.idParametros == this.dataFicha.datosAcompaniante.paramParentescoId)?.nombre!;
        })
        this.datosService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data)=>{
          this.tipoDocAcomp = data.data.find((x)=> x.idParametros == this.dataFicha.datosAcompaniante.paramTipoDocId)?.nombre!;
        })
      }

      // console.log(data);
      this.wait = true;
    });
  }
  Imprimir(){
    console.log(1)
    this.opcionesBotones[3].loading = true;
    this.status = 'loading';
    this._admissionService.getImpresionFichaAdmision(this.idFicha).subscribe((data)=>{
      const blob = new Blob([data], { type: 'application/pdf' }); // Asume que es un PDF. Cambia el tipo MIME si es necesario.
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
      this.status = 'success';
      this.opcionesBotones[3].loading = false;
      this.showModalFunc();
      //window.print();
    })
    // window.print()
  }
  loadBlobContent(blob: Blob) {
    const reader = new FileReader();
    reader.onload = () => {
      this.blobContent = blob;
    };
    reader.readAsDataURL(blob);
  }

  getDireccionDatos(direcciones: any){
    direcciones.map((dir: any) =>{
      let direccion: direccionFichaFront = Object();
      this.datosService.getTipoParametros('TIPO_DIRECCION').subscribe((data)=>{
        direccion.nomParametro = data.data.find((x: any)=>{return x.idParametros == dir.paramTipoId})!.nombre;
      })
      this.datosService.getDepartamentosReniec().subscribe((data)=>{
        direccion.nomDep = data.data.find((x: any)=>{return x.codUbigeo == dir.codUbiDep.trim()+'0000'})!.descUbigeo;
      })
      this.datosService.getProvinciasReniec(dir.codUbiDep.trim()).subscribe((data)=>{
        direccion.nomProv = data.data.find((x: any)=>{return x.codUbigeo == dir.codUbiDep.trim()+dir.codUbiProv.trim()+'00'})!.descUbigeo;
      })
      this.datosService.getDistritosReniec(dir.codUbiDep.trim()+dir.codUbiProv.trim()).subscribe((data)=>{
        direccion.nomDist = data.data.find((x: any)=>{return x.codUbigeo == dir.codUbiDep.trim()+dir.codUbiProv.trim()+dir.codUbiDist.trim()})!.descUbigeo;
      })
      direccion.paramTipoId = dir.paramTipoId;
      direccion.direccion = dir.direccion;
      direccion.pisoNumDep = dir.pisoNumDep;
      direccion.codDep = dir.codUbiDep.trim();
      direccion.codProv = dir.codUbiProv.trim();
      direccion.codDist = dir.codUbiDist.trim();
      direccion.activo = dir.activo;

      if(dir.activo == 1){
        this.direccionElegida = direccion;
        console.log(this.direccionElegida)
      }
      this.direccionesPersona.push(direccion);
    })
  }
  cargaServiciosParametros(){
    this.datosService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data)=>{
      this.listParamDocumento = data.data;
    })
    this.datosService.getTipoParametros('TIPO_DIRECCION').subscribe((data)=>{
      this.listParamDirecciones = data.data;
    })
    this.datosService.getTipoParametros('MOD_INGRESO_ADMISION').pipe(map(msg => msg.data.sort((a1: Parametro, a2: Parametro) => parseInt(a1.valor1) - parseInt(a2.valor1)))).subscribe((data)=>{
      this.listParamModIngr = data;
      console.log(this.listParamModIngr)
    })
    // this._datoGeneralesService.getTipoParametros('REQ_APOYO_OTRA_PERSO').subscribe((data)=>{
    //   console.log('Apoyo otra persona: ', data)
    // })
    this.datosService.getTipoParametros('PARENTESCO').subscribe((data)=>{
      this.listParamRelacion = data.data;
    })
  }

  // ----------------------------------------------
  showModal: boolean = false;

  showModalFunc() {
      this.showModal = true;
      // código para obtener y mostrar el PDF como se describió anteriormente
  }

  closeModal() {
      this.showModal = false;
  }

  funcionesExtra(opt: number){
    switch (opt) {
      case 0:
        
        break;
      case 1:
        
        break;
      case 2:
        this.router.navigate(['/app/admission/edit/'+this.idFicha]);
        break;
    }
  }
}
