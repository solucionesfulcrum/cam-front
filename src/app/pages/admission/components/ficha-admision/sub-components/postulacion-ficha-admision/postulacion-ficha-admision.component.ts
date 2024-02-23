import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { DialogDataAcompanianteComponent } from './dialogs/dialog-data-acompaniante/dialog-data-acompaniante.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DialogNewDireccionComponent } from './dialogs/dialog-new-direccion/dialog-new-direccion.component';
import { DialogModalidadIngresoComponent } from './dialogs/dialog-modalidad-ingreso/dialog-modalidad-ingreso.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AdmisionFichaService } from '@services/admision/admision-ficha.service';
import { acompanianteFicha, contactoFicha, dataRequest, datosAseguradoFicha, datosFicha, direccionFicha, modalidadIngreso, procedenciaFicha, registerFichaRequest } from '@models/admision/ficha-admision.model';
import { dataPersonaResponse } from '@models/admision/datos-persona.model';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Parametro } from '@models/parametros-busqueda.model';
import { AcompanianteData, direccionFichaFront } from '@models/admision/ficha-datos-adicionales.model';
import { map } from 'rxjs';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { AdmisionCitasService } from '@services/admision/admision-citas.service';
import { generateFirstAttentionRequest } from '@models/admision/citas/datos-persona.model';

@Component({
  selector: 'esp-postulacion-ficha-admision',
  templateUrl: './postulacion-ficha-admision.component.html',
  styleUrls: ['./postulacion-ficha-admision.component.scss']
})
export class PostulacionFichaAdmisionComponent implements OnInit {

  faSpinner = faSpinner;
  wait = false;
  msgFaltante = false ;
  idUnidadOperativaUser = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;
  idUserSession = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario;
  // <!---------------------------------------------------- Primer paso:  Datos del Asegurado                     --------------------------------------------------->

  numHistoria: string = '';
  listParamDocumento!: Parametro[];
  parametroDocumento!: Parametro;
  numDoc: string = '';
  tipoDoc: string = '';

  edadPersona: number = 0;
  imagenAdmision: any = null;

  dataSeguro: any = [''];
  // dataPersona!: dataPersonaResponse;
  dataPersonal: any = [''];
  dataAfiliado: any = [''];
  dataRed: any = [''];
  datosAdmision:any;

  infoReniec: any = Object();
  // <!---------------------------------------------------- Segundo paso: Datos de direcciones                    --------------------------------------------------->

  frmCtrlDireccion = new FormControl(null);
  listParamDirecciones!: Parametro[];
  direccionesPersona: direccionFichaFront[] = [];

  // <!---------------------------------------------------- Tercer paso:  Datos de Contacto                       --------------------------------------------------->

  formDatosContacto = this.fb.nonNullable.group({
    frmTelefono: ['', [Validators.required,Validators.minLength(7)]],
    frmCelular: ['', [Validators.required,Validators.minLength(9)]],
    frmWsp: [null, Validators.required],
    frmCorreo: ['', [Validators.required,Validators.email]]
  });

  // <!---------------------------------------------------- Cuarto paso:  Datos de Procedencia                    --------------------------------------------------->

  frmCtrlModIngr = new FormControl(null);

  selectProcedenciaDerivOtro: string = '';
  datoProcedenciaDerivOtro: string = '';
  datosProcedenciaExtra: boolean = false;

  modalidadIngresoData: any = {};

  listParamModIngr: Parametro[] = [];

  // <!---------------------------------------------------- Quinto paso: Datos del acompañante y Observación      --------------------------------------------------->

  frmCtrlAcompaniamiento = new FormControl(null);
  listParamRelacion: Parametro[] = [];

  requiereApoyo: boolean = false;

  acompanianteData: AcompanianteData = Object();

  public formApoyo = this.fb.nonNullable.group({
    frmSelectParentesco:[''],
    frmSelectDoc:[''],
    frmDoc:[undefined],
    frmNombres:[undefined],
    frmApellidos:[undefined],
    frmCelular:[undefined]
  });

  frmCtrlObservacion = new FormControl();

  // <!-------------------------------------------------------------------------------------------------------------------------------------------------------------->

  constructor(private dialog : Dialog,
              private fb:FormBuilder,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private toastr: ToastrService,
              private _admissionService: AdmisionFichaService,
              private _citasService: AdmisionCitasService,
              private _datoGeneralesService: DatosGeneralesService) {
                this.numDoc = this.activeRoute.snapshot.paramMap.get('numDoc')!;
                this.tipoDoc = this.activeRoute.snapshot.paramMap.get('tipoDoc')!;
              }
  
  ngOnInit(){
    this._admissionService.getDatoSeguro(this.tipoDoc,this.numDoc).subscribe((data)=>{
      console.log(data)
      this.dataSeguro = Object(data.response[0]);
    })
    this._admissionService.searchAndFindData(this.getData()).subscribe((data : any)=>{
      this.dataPersonal = data.data.dataPersona;
      this.dataAfiliado = data.data.dataAfiliado[0];
      this._datoGeneralesService.getRedesAsistenciales().subscribe((datos)=>{//-------------------------------------------------------------------------------------------------------------------------------- Fallando
        this.dataRed = datos.response.find((x: any)=> {return x.cod_CENTRO  === this.dataAfiliado.codCentro});
      })
    });
    this.frmCtrlDireccion.valueChanges.subscribe((data)=>{
      if(data!>=0){
        this.direccionesPersona.map(x=>{
          x.activo = 0
        });
        this.direccionesPersona[data!].activo = 1;
      }
    })
    this.cargaServiciosParametros();
    // this._admissionService.getDataPersonaReniec(this.numDoc).subscribe((data)=>{//-------------------------------------------------------------------------------------------------------------------------------- Fallando
    //   console.log(data)
    //   this.imagenAdmision = data.fotoBase64;
    //   this.dataPersona = data;
    //   var dateParts = this.dataPersona.persona.datosNacimiento.fechaNacimiento.split("/");
    //   var dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]); 
    //   var timeDiff = Math.abs(Date.now() - dateObject.getTime());
    //   this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    //   this.administrarDirecciones('RENIEC', this.dataPersona.persona.datosDomicilio)
    //   console.log(data);
    //   this.wait = true;
    // });
    this._admissionService.getImgPersona((`0${this.tipoDoc}`).slice(-2), this.numDoc).subscribe((data)=>{
      if (data.code == 0) {
        this.infoReniec = data.data.data;
        this.imagenAdmision = data.data.data.fotoBase64;
        var dateParts = this.infoReniec.fecNacimiento.trim().split('/');
        var dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]); 
        var timeDiff = Math.abs(Date.now() - dateObject.getTime());
        this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);

        this._datoGeneralesService.getTipoParametros('TIPO_DIRECCION').subscribe((data)=>{
          this.listParamDirecciones = data.data;
          this.administrarDirecciones('RENIEC', this.infoReniec);

          this.wait = true;
        })
        // this._datoGeneralesService.searchByUbigeo(this.infoReniec.codUbgNac).subscribe((data)=>{
        //   if (data.code == 0) {
        //     this.infoReniec.desNacubiDepa = data.data.region;
        //     this.infoReniec.desNacubiProv = data.data.provincia;
        //     this.infoReniec.desNacubiDist = data.data.distrito;
        //   }
        //   else{
        //     this.toastr.warning(data.mensaje);
        //   }
        // })

        // this._admissionService.getInformacionPersona((`0${this.tipoDoc}`).slice(-2), this.numDoc).subscribe((data)=>{
        //   console.log(data)
        //   if (data.status === 'success') {
        //     // this.infoReniec = data.data;
        //     this.infoReniec.desSexoPersona = data.data.desSexoPersona;
        //     this.infoReniec.desEstadoCivil = data.data.desEstadoCivil;
        //   }
        //   else{
        //     this.toastr.warning(data.mensaje);
        //   }
        // })
      }
      else{
        this.toastr.warning(data.message);
      }
    })
    // this._admissionService.getInformacionPersona()
    this.frmCtrlDireccion.addValidators([Validators.required]);
    this.frmCtrlModIngr.addValidators([Validators.required]);
    this.frmCtrlAcompaniamiento.addValidators([Validators.required]);
  }
  // <!---------------------------------------------------- Primer paso:  Datos del Asegurado                     --------------------------------------------------->


  cargaServiciosParametros(){
    this._admissionService.getNumeroHistoria(this.idUnidadOperativaUser).subscribe((data)=>{
      this.numHistoria = data.data;
    })
    this._datoGeneralesService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data)=>{
      this.listParamDocumento = data.data;
      this.parametroDocumento = data.data.find((x) => x.valor1 == this.tipoDoc)!;
    })
    // this._datoGeneralesService.getTipoParametros('TIPO_DIRECCION').subscribe((data)=>{
    //   this.listParamDirecciones = data.data;
    // })
    this._datoGeneralesService.getTipoParametros('MOD_INGRESO_ADMISION').pipe(map(msg => msg.data.sort((a1: Parametro, a2: Parametro) => parseInt(a1.valor1) - parseInt(a2.valor1)))).subscribe((data)=>{
      this.listParamModIngr = data;
    })
    // this._datoGeneralesService.getTipoParametros('REQ_APOYO_OTRA_PERSO').subscribe((data)=>{
    //   console.log('Apoyo otra persona: ', data)
    // })
    this._datoGeneralesService.getTipoParametros('PARENTESCO').subscribe((data)=>{
      this.listParamRelacion = data.data;
    })
  }
  
  getDataAsegurado(): datosAseguradoFicha{
    var dateParts = this.infoReniec.fecNacimiento.trim().split('/');
    // var tempPhotoBase64: string = '';
    // function getBase64Image(img: any) {
    //   var canvas = document.createElement("canvas");
    //   canvas.width = img.naturalWidth;
    //   canvas.height = img.naturalHeight ;
    //   var ctx = canvas.getContext("2d");
    //   ctx!.drawImage(img, 0, 0);
    //   var dataURL = canvas.toDataURL("image/png");
    //   tempPhotoBase64 = dataURL.split(",")[1];
    // }

    // getBase64Image(document.getElementById("imgTemp"))

    return {
      tipDocIdent: this.parametroDocumento.valor1,
      descTipDocIdent: this.parametroDocumento.nombre,
      numDocIdent: this.numDoc,
      nombres: this.infoReniec.txtNombres,
      apePaterno: this.infoReniec.txtApepaterno,
      apeMaterno: this.infoReniec.txtApematerno,
      departNacim: this.infoReniec.desNacubiDepa,
      provinNacim: this.infoReniec.desNacubiProv,
      distriNacim: this.infoReniec.desNacubiDist,
      ubigeoNacim: this.infoReniec.codUbgNac,
      fecNacimiento: `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`, // yyyy-mm-dd with 0
      codEstCivil: this.infoReniec.codEstcivil,
      descEstCivil: this.infoReniec.desEstadoCivil,
      codSexo: this.infoReniec.desSexoPersona[0],
      descSexo: this.infoReniec.desSexoPersona,
      // nombres: this.dataPersona.persona.datosBasicos.nombres,
      // apePaterno: this.dataPersona.persona.datosBasicos.apellidoPaterno,
      // apeMaterno: this.dataPersona.persona.datosBasicos.apellidoMaterno,
      // departNacim: this.dataPersona.persona.datosNacimiento.departamento,
      // provinNacim: this.dataPersona.persona.datosNacimiento.provincia,
      // distriNacim: this.dataPersona.persona.datosNacimiento.distrito,
      // ubigeoNacim: this.dataPersona.persona.datosNacimiento.codigoUbigeoDepartamento + this.dataPersona.persona.datosNacimiento.codigoUbigeoProvincia + this.dataPersona.persona.datosNacimiento.codigoUbigeoDistrito,
      // fecNacimiento: this.dataPersona.persona.datosNacimiento.fechaNacimiento.split('/')[2] + '-' + this.dataPersona.persona.datosNacimiento.fechaNacimiento.split('/')[1] + '-' + this.dataPersona.persona.datosNacimiento.fechaNacimiento.split('/')[0], // yyyy-mm-dd with 0
      // codEstCivil: this.dataPersona.persona.datosAdicionales.codigoEstadoCivil,
      // descEstCivil: this.dataPersona.persona.datosAdicionales.descripcionEstadoCivil,
      // codSexo: this.dataPersona.persona.datosAdicionales.descripcionSexo[0],
      // descSexo: this.dataPersona.persona.datosAdicionales.descripcionSexo,
      // codTipoAsegurado: this.dataSeguro.TIPO_CONDICION, // CAMBIAR LUEGO DE TENER ESTE DATO EN PROD
      codTipoAsegurado: this.dataSeguro.CONDICION[0],
      descTipoAsegurado: this.dataSeguro.CONDICION,
      // codTipoSeguro: this.dataSeguro.CODIGO_TIPOSEGURO, // CAMBIAR LUEGO DE TENER ESTE DATO EN PROD
      codTipoSeguro: '0',
      descTipoSeguro: 'Seguro ' + this.dataSeguro.DGACTAS,
      codIpressAdscrip: this.dataAfiliado.codCentro,
      nomIpressAdscrip: this.dataAfiliado.desCentro,
      codRedAsisten: this.dataRed.cod_RED,
      nomRedAsisten: this.dataRed.des_RED,
      usuarioRegId: this.idUserSession,
      activo: 1,
      // foto: tempPhotoBase64,
      foto: this.imagenAdmision,
      fecFallecimiento:  this.dataPersonal.fefallecid
    };
  }

  // <!---------------------------------------------------- Segundo paso: Datos de direcciones                    --------------------------------------------------->

  administrarDirecciones(opcion: any, datos: any){
    let direccionObj: direccionFichaFront = Object();
    if(typeof opcion === 'string'){
      this._datoGeneralesService.searchByUbigeo(datos.codUbgDom).subscribe((data)=>{
        if (data.code == 0) {
          direccionObj.paramTipoId = this.listParamDirecciones.find((x) => x.nombre === opcion)!.idParametros;      
          direccionObj.nomParametro = opcion;
          direccionObj.direccion = datos.txtDireccion;
          direccionObj.pisoNumDep = '';
          direccionObj.codDep = datos.codUbgDom.match(/.{1,2}/g)[0];
          direccionObj.codProv = datos.codUbgDom.match(/.{1,2}/g)[1];
          direccionObj.codDist = datos.codUbgDom.match(/.{1,2}/g)[2];
          direccionObj.nomDep = data.data.region;
          direccionObj.nomProv = data.data.provincia;
          direccionObj.nomDist = data.data.distrito;
          direccionObj.activo = 0;
          // direccionObj.paramTipoId = this.listParamDirecciones.find((x) => x.nombre === opcion)!.idParametros;      
          // direccionObj.nomParametro = opcion;
          // direccionObj.direccion = datos.direccion;
          // direccionObj.pisoNumDep = '';
          // direccionObj.codDep = datos.codigoUbigeoDepartamento;
          // direccionObj.codProv = datos.codigoUbigeoProvincia;
          // direccionObj.codDist = datos.codigoUbigeoDistrito;
          // direccionObj.nomDep = datos.departamento;
          // direccionObj.nomProv = datos.provincia;
          // direccionObj.nomDist = datos.distrito;
          // direccionObj.activo = 0;
          this.direccionesPersona.push(direccionObj)
        }
        else{
          this.toastr.warning(data.mensaje);
        }
      })
    }
  }

  showNewDireccion(){
    const dialogRef = this.dialog.open(DialogNewDireccionComponent,{
      minWidth:'600px',
      maxWidth:'50%',
      data:{ 
        edicion: false,
      }
    })
    dialogRef.closed.subscribe(data =>{
      const dataObj = Object(data)
      if(dataObj.estadoEnvio == 1){
        this.direccionesPersona.push(dataObj.datos)
      }
    })
  }

  editDireccion(id: number){
    const dialogRef = this.dialog.open(DialogNewDireccionComponent,{
      minWidth:'600px',
      maxWidth:'50%',
      data:{
        edicion: true,
        dataForm: this.direccionesPersona[id],
        estadoEnvio: 0, //0 = cancelar edicion, 1 = guardar edicion, 2 = eliminar item
      }
    })
    dialogRef.closed.subscribe(data =>{
      const dataObj = Object(data)
      if(dataObj.estadoEnvio == 1){
        this.direccionesPersona[id] = dataObj.datos;
      }
      if(dataObj.estadoEnvio == 2){
        this.direccionesPersona.splice(id,1);
        if(dataObj.reiniciarForm){
          this.frmCtrlDireccion.reset();
        }
      }
    })
  }

  getDataDirecciones(): direccionFicha[]{
    return this.direccionesPersona.map(x=>{
      let direccion: direccionFicha = Object();
      direccion.paramTipoId = x.paramTipoId;
      direccion.codUbiDep = x.codDep;
      direccion.codUbiProv = x.codProv;
      direccion.codUbiDist = x.codDist;
      direccion.direccion = x.direccion;
      direccion.pisoNumDep = x.pisoNumDep;
      direccion.descUbiDep = x.nomDep;
      direccion.descUbiProv = x.nomProv;
      direccion.descUbiDist = x.nomDist;
      direccion.activo = x.activo;
      return direccion;
    });
  }

  // <!---------------------------------------------------- Tercer paso:  Datos de Contacto                       --------------------------------------------------->

  getDataContacto(): contactoFicha{
    return {
      telefono: this.formDatosContacto.value.frmTelefono!,
      celular: this.formDatosContacto.value.frmCelular!,
      tieneWhatsapp: this.formDatosContacto.value.frmWsp!,
      correo: this.formDatosContacto.value.frmCorreo!
    };
  }
  // <!---------------------------------------------------- Cuarto paso:  Datos de Procedencia                    --------------------------------------------------->

  showDatosProcedencia(opt: number, modalidad: string){
    if (opt < 2) {
      this.datosProcedenciaExtra = false;
    }
    else{
      let type: number = 0;
      let seleccion: string;
      switch (opt) {
        case 2: 
          type = 1;
          seleccion = 'IPRESS';
          break;
        case 3:
          type = 2;
          seleccion = 'CERPS';
          break;
        case 4:
          type = 3;
          seleccion = 'MBRPS';
          break;
      }
      const dialogRef = this.dialog.open(DialogModalidadIngresoComponent,{
        minWidth:'600px',
        maxWidth:'50%',
        data:{
          type: type,
          guarda: false,
          nombre: '',
        }
      })
      dialogRef.closed.subscribe(data =>{
        var dataObj = Object(data)
        if(dataObj.guarda == true){
          this.datosProcedenciaExtra = true;
          this.selectProcedenciaDerivOtro = seleccion;
          this.datoProcedenciaDerivOtro = dataObj.nombre;
          this.modalidadIngresoData = dataObj.modalidadIngreso;
        }
        else{
          this.opcionCancelada(modalidad);
        }
      })
    }
  }

  opcionCancelada(modalidad: string){
    (document.getElementById(modalidad) as HTMLInputElement).checked = false;
    this.frmCtrlModIngr.setValue(null);
    this.datosProcedenciaExtra = false;
    this.selectProcedenciaDerivOtro = '';
    this.datoProcedenciaDerivOtro = '';
  }

  getDataModalidadIngreso(): procedenciaFicha{
    let procedencia: procedenciaFicha = Object();
    let modalidadExtra: modalidadIngreso = Object();
    procedencia.paramModIngresoId = this.frmCtrlModIngr.value!;
    if(this.frmCtrlModIngr.value == 1){
      modalidadExtra.tipoModalidad = 'DERIVACION_IPRES';
      modalidadExtra.codIpres = this.modalidadIngresoData.ubigeo;
      modalidadExtra.nomIpres = this.modalidadIngresoData.establecimiento;
      procedencia.modalidadIngreso = modalidadExtra;
    }
    else if(this.frmCtrlModIngr.value == 5){
      modalidadExtra.tipoModalidad = 'OTRA_UNID_OPE_CERPS';
      modalidadExtra.codCerps = this.modalidadIngresoData.idUnidOperativa;
      modalidadExtra.nomCerps = this.modalidadIngresoData.nombre;
      procedencia.modalidadIngreso = modalidadExtra;
    }
    else if(this.frmCtrlModIngr.value == 6){
      modalidadExtra.tipoModalidad = 'OTRA_UNID_OPE_MPRPS';
      modalidadExtra.codMbrps = this.modalidadIngresoData.idUnidOperativa;
      modalidadExtra.nomMbrps = this.modalidadIngresoData.nombre;
      procedencia.modalidadIngreso = modalidadExtra;
    }
    return procedencia;
  }

  // <!---------------------------------------------------- Quinto paso: Datos del acompañante y Observación      --------------------------------------------------->

  showDataAcompaniante(opt: number){
    if (opt == 1 && this.requiereApoyo == false) {
      const dialogRef = this.dialog.open(DialogDataAcompanianteComponent,{
        width:'45%',
        data:{ }
      })
      dialogRef.closed.subscribe(data =>{
        const dataObj = Object(data)
        if(dataObj.siEnvia){
          console.log(data)
          this.requiereApoyo = true;
          this.acompanianteData.parentesco = dataObj.parentesco;
          this.acompanianteData.tipoDoc = dataObj.tipoDoc;
          this.acompanianteData.nroDoc = dataObj.nroDoc;
          this.acompanianteData.nombres = dataObj.nombres;
          this.acompanianteData.apellidos = dataObj.apellidos;
          this.acompanianteData.telefono = dataObj.telefono;
          this.acompanianteData.correo = dataObj.correo;
          this.acompanianteData.celular = dataObj.celular;
          this.acompanianteData.wsp = dataObj.wsp;''

          this.formApoyo.value.frmSelectParentesco = this.listParamRelacion.find((x)=>{return x.idParametros.toString() === dataObj.parentesco})!.nombre;
          this.formApoyo.value.frmSelectDoc = dataObj.tipoDoc === '25'? 'DNI' : this.listParamDocumento.find((x)=>{return x.idParametros.toString() === dataObj.tipoDoc})!.nombre;
          this.formApoyo.value.frmDoc = dataObj.nroDoc;
          this.formApoyo.value.frmNombres = dataObj.nombres;
          this.formApoyo.value.frmApellidos = dataObj.apellidos;
          this.formApoyo.value.frmCelular = dataObj.celular;
        }
        else{
          (document.getElementById("siApoyo") as HTMLInputElement).checked = false;
          this.frmCtrlAcompaniamiento.setValue(null)
        }
      })
    }
    if (opt == 2) {
      this.requiereApoyo = false;
    }
  }

  getDataAcompaniante(): acompanianteFicha{
    if(this.frmCtrlAcompaniamiento.value === 'SI'){
      return {
        requiereApoyo: this.frmCtrlAcompaniamiento.value!,
        paramParentescoId: parseInt(this.acompanianteData.parentesco),
        paramTipoDocId: parseInt(this.acompanianteData.tipoDoc),
        nroDocumento: this.acompanianteData.nroDoc,
        nombres: this.acompanianteData.nombres,
        apellidos: this.acompanianteData.apellidos,
        telefono: this.acompanianteData.telefono,
        celular: this.acompanianteData.celular,
        tieneWhatsapp: this.acompanianteData.wsp,
        correo: this.acompanianteData.correo
      }
    }
    else{
      return {
        requiereApoyo: this.frmCtrlAcompaniamiento.value!,
      }
    }
  }

  // <!-------------------------------------------------------------------------------------------------------------------------------------------------------------->

  showForm(){
    console.log('Request Ficha:')
    console.log(this.getRequestFicha())
  }

  getDatosFicha(): datosFicha{
    return{
      idUnidadOpe: this.idUnidadOperativaUser,
      numHistClinica: this.numHistoria,
      codRedAsistencial: this.dataRed.cod_RED,
      codCentro: this.dataAfiliado.codCentro,
      observacion: this.frmCtrlObservacion.value,
      idUsuarioReg: this.idUserSession,
      activo: 1,
      direccion: this.getDataDirecciones(),
      datosContacto: this.getDataContacto(),
      datosProcedencia: this.getDataModalidadIngreso(),
      datosAcompaniante: this.getDataAcompaniante()
    }
  }

  getRequestFicha(): registerFichaRequest{
    return{
      asegurado: this.getDataAsegurado(),
      fichaAdmision: this.getDatosFicha()
    }
  }

  sendRequestFichaAdmision(){
    if(this.validarFicha()){
      this._admissionService.registerFichaAdmision(this.getRequestFicha()).subscribe((data)=>{
        console.log(data);
        if(data.code != 0){
          this.toastr.warning(data.message);
          console.log(this.getRequestFicha())
        }
        else{
          let modelo = this.getDataToFirstAttention(data.data.fichaAdmision.fichaAdmisionId);
          console.log(modelo)
          this._citasService.generarPrimeraCita(modelo).subscribe((data)=>{
            console.log(data);
            if (data.code == 0) {
              this.toastr.success('Se ha registrado con éxito la ficha de admisión');
              this.router.navigate(['/app/admission']);
            }
            else{
              this.toastr.warning(data.message);
            }
          })
        }
      })
    }
    else{
      this.msgFaltante = true;
    }
  }

  validarFicha(): boolean{
    let direccionesValid = false;
    if(this.frmCtrlDireccion.valid){
      direccionesValid = true;
    }
    else{
      this.frmCtrlDireccion.markAllAsTouched();
    }

    let contactoValid = false;
    if (this.formDatosContacto.valid) {
      contactoValid = true;
    }
    else{
      this.formDatosContacto.markAllAsTouched();
    }
    
    let procedenciaValid = false;
    if(this.frmCtrlModIngr.valid){
      procedenciaValid = true;
    }
    else{
      this.frmCtrlModIngr.markAllAsTouched();
    }

    let acompanianteValid = false;
    if(this.frmCtrlAcompaniamiento.valid){
      acompanianteValid = true;
    }
    else{
      this.frmCtrlAcompaniamiento.markAllAsTouched();
    }

    if(this.frmCtrlAcompaniamiento.value === 'NO' && this.edadPersona < 18){
      acompanianteValid = false;
    }

    if(direccionesValid && contactoValid && procedenciaValid && acompanianteValid){
      return true;
    }
    else return false;

  }

  getData(): dataRequest{
    return {
      codOpcion: '1',
      tipoDoc: this.tipoDoc,
      numDoc: this.numDoc 
    }
  }

  getDataToFirstAttention(fichaId: number): generateFirstAttentionRequest{
    return {
      fichaAdmisionId: fichaId,
      unidOperativaId: this.idUnidadOperativaUser,
      usuarioId: this.idUserSession
    }
  }

}