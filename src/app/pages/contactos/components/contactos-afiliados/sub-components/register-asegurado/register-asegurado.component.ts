import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { dataRequest, direccionFichaFront } from '@models/afiliados/ficha-solicitud.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { NotificationService } from '@services/notification.service';
import { ContactosAfiliadosService } from 'src/app/data/services/contactos/contactos-afiliados.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { DialogNewDireccionComponent } from '../dialog/dialog-new-direccion/dialog-new-direccion.component';
import { DialogModalidadIngresoComponent } from '../dialog/dialog-modalidad-ingreso/dialog-modalidad-ingreso.component';
import { map } from 'rxjs';
import { contactoFicha, datosAseguradoFicha, datosFicha, direccionFicha, modalidadIngreso, procedenciaFicha, registerFichaRequest } from '@models/afiliados/register-ficha-solicitud';
import { RegisterSolicitud } from '@models/afiliaciones/register-afiliacion.model';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { RequestStatus } from '@models/request-status.model';

@Component({
  selector: 'esp-register-asegurado',
  templateUrl: './register-asegurado.component.html',
  styleUrls: ['./register-asegurado.component.scss']
})
export class RegisterAseguradoComponent {

  faSpinner = faSpinner;
  status: RequestStatus = 'init';
  wait = false;
  msgFaltante = false;
  idUnidadOperativaUser = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;
  idUserSession = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario;
  numDoc: string = '';
  tipoDoc: string = '';
  
  // <!---------------------------------------------------- Primer paso:  Datos del Asegurado                     --------------------------------------------------->

  numHistoria: string = '';
  listParamDocumento!: Parametro[];
  parametroDocumento!: Parametro;

  edadPersona: number = 0;
  imagenAdmision: any = null;

  dataSeguro: any = Object();
  dataRed: any = Object();
  feFallecimiento: string = '';

  infoReniec: any = Object();
  
  // <!---------------------------------------------------- Segundo paso: Datos de direcciones                    --------------------------------------------------->

  frmCtrlDireccion = new FormControl(null);
  listParamDirecciones!: Parametro[];
  direccionesPersona: direccionFichaFront[] = [];

  // <!---------------------------------------------------- Tercer paso:  Datos de Contacto                       --------------------------------------------------->

  formDatosContacto = this.fb.nonNullable.group({
    frmTelefono: ['0'],
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

  // frmCtrlAcompaniamiento = new FormControl(null);
  // listParamRelacion: Parametro[] = [];

  // requiereApoyo: boolean = false;

  // acompanianteData: AcompanianteData = Object();

  // public formApoyo = this.fb.nonNullable.group({
  //   frmSelectParentesco:[''],
  //   frmSelectDoc:[''],
  //   frmDoc:[undefined],
  //   frmNombres:[undefined],
  //   frmApellidos:[undefined],
  //   frmCelular:[undefined]
  // });

  frmCtrlObservacion = new FormControl();

  // <!-------------------------------------------------------------------------------------------------------------------------------------------------------------->

  constructor(private dialog                            : Dialog,
              private fb                                : FormBuilder,
              private router                            : Router,
              private activeRoute                       : ActivatedRoute,
              private solicitudesService                : AfiliacionesSolicitudesService,
              private _contactoService                  : ContactosAfiliadosService,
              private _notificacionService              : NotificationService,
              private _datoGeneralesService             : DatosGeneralesService) {
                this.numDoc = this.activeRoute.snapshot.paramMap.get('numDoc')!;
                this.tipoDoc = this.activeRoute.snapshot.paramMap.get('tipoDoc')!;
              }
  
  ngOnInit(){
    this._datoGeneralesService.validarAdmisionIngreso(this.tipoDoc, this.numDoc, this.idUnidadOperativaUser, 1).subscribe((data)=>{
      if (data.code == 0) {
        if (data.data.acreditado) {
          this.getParametros();
          this.getDataFromServices();
          this.frmCtrlDireccion.valueChanges.subscribe((data)=>{
            if(data!>=0){
              this.direccionesPersona.map(x=>{
                x.activo = 0
              });
              this.direccionesPersona[data!].activo = 1;
            }
          })
      
          this.frmCtrlDireccion.addValidators([Validators.required]);
          this.frmCtrlModIngr.addValidators([Validators.required]);
        }
        else{
          this._notificacionService.warning(data.data.mensaje);
          this.router.navigate(['/app/afiliados']);
        }
      }
      else{
        this._notificacionService.warning(data.message);
      }
    })
  }

  getDataFromServices(){
    // Obtener codCentro ------------------------------------------------------------------------------------------------------------------------------
    this._contactoService.servicioObtenerCodCentro(this.requestDataCodCentro()).subscribe((data)=>{
      if (data.code == 0) {
        this._datoGeneralesService.getRedesAsistenciales().subscribe((datos)=>{
          if (datos.codResultado == 0) {
            this.dataRed = datos.response.find((x: any)=> {return x.cod_CENTRO  === data.data.dataAfiliado[0].codCentro});
            this.feFallecimiento = data.data.dataPersona.fefallecid;
            // console.log(this.dataRed)
          }
          else{
            this._notificacionService.warning(datos.msgResultado);
          }
        })
      }
      else{
        this._notificacionService.warning(data.message);
      }
    });

    // Obtener Info Persona ------------------------------------------------------------------------------------------------------------------------------
    this._contactoService.servicioObtenerDataPersona((`0${this.tipoDoc}`).slice(-2), this.numDoc).subscribe((data)=>{
      if (data.code == 0) {
        this.infoReniec = data.data.data;
        this.imagenAdmision = data.data.data.fotoBase64;
        var dateParts = this.infoReniec.fecNacimiento.trim().split('/');
        var dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]); 
        var timeDiff = Math.abs(Date.now() - dateObject.getTime());
        this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);

        this._datoGeneralesService.getTipoParametros('TIPO_DIRECCION').subscribe((datos)=>{
          if (datos.code == 0) {
            this.listParamDirecciones = datos.data;
            this.administrarDirecciones('RENIEC', this.infoReniec);

            this.wait = true;
          }
          else{
            this._notificacionService.warning(datos.message);
          }
        })
      }
      else{
        this._notificacionService.warning(data.message);
      }
    })
    
    // Obtener Info Seguro ------------------------------------------------------------------------------------------------------------------------------
    this._contactoService.getDatoSeguro(this.tipoDoc,this.numDoc).subscribe((data)=>{
      this.dataSeguro = Object(data.response[0]);
    })
  }

  getParametros(){
    this._datoGeneralesService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data)=>{
      this.listParamDocumento = data.data;
      this.parametroDocumento = data.data.find((x) => x.valor1 == this.tipoDoc)!;
    })
    this._datoGeneralesService.getTipoParametros('MOD_INGRESO_ADMISION').pipe(map(msg => msg.data.sort((a1: Parametro, a2: Parametro) => parseInt(a1.valor1) - parseInt(a2.valor1)))).subscribe((data)=>{
      this.listParamModIngr = data;
    })
  }

  requestDataCodCentro(): dataRequest{
    return {
      codOpcion: '1',
      tipoDoc: this.tipoDoc,
      numDoc: this.numDoc 
    }
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
          this._notificacionService.warning(data.mensaje);
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

  
  showDatosProcedencia(opt: number, modalidad: string){
    // console.log(opt)
    if (opt < 1) {
      this.datosProcedenciaExtra = false;
    }
    else{
      let type: number = 0;
      let seleccion: string;
      switch (opt) {
        case 1: 
          type = 3;
          seleccion = 'CAM';
          break;
        case 2:
          type = 1;
          seleccion = 'IPRESS';
          break;
        case 3:
          type = 2;
          seleccion = 'CERPS';
          break;
      }
      if (opt != 4) {
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
  }
  opcionCancelada(modalidad: string){
    // (document.getElementById(modalidad) as HTMLInputElement).checked = false;
    this.frmCtrlModIngr.setValue(null);
    this.datosProcedenciaExtra = false;
    this.selectProcedenciaDerivOtro = '';
    this.datoProcedenciaDerivOtro = '';
  }

  getDataModalidadIngreso(): procedenciaFicha{
    let procedencia: procedenciaFicha = Object();
    let modalidadExtra: modalidadIngreso = Object();
    procedencia.idModIngresoParam = this.frmCtrlModIngr.value!;
    if(this.frmCtrlModIngr.value == 21){
      modalidadExtra.tipoModalidad = 'DERIVACION_IPRES';
      modalidadExtra.codIpres = this.modalidadIngresoData.cod_centro;
      modalidadExtra.nomIpres = this.modalidadIngresoData.nom_centro;
      procedencia.modalidadIngreso = modalidadExtra;
    }
    else if(this.frmCtrlModIngr.value == 22){
      modalidadExtra.tipoModalidad = 'DERIVACION_UO_CERPS';
      modalidadExtra.codCerps = this.modalidadIngresoData.idUnidOperativa;
      modalidadExtra.nomCerps = this.modalidadIngresoData.nombre;
      procedencia.modalidadIngreso = modalidadExtra;
    }
    else if(this.frmCtrlModIngr.value == 20){
      modalidadExtra.tipoModalidad = 'DERIVACION_CAM';
      modalidadExtra.codCam = this.modalidadIngresoData.codigo;
      modalidadExtra.nomCam = this.modalidadIngresoData.nombre;
      procedencia.modalidadIngreso = modalidadExtra;
    }
    return procedencia;
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

    // let acompanianteValid = false;
    // if(this.frmCtrlAcompaniamiento.valid){
    //   acompanianteValid = true;
    // }
    // else{
    //   this.frmCtrlAcompaniamiento.markAllAsTouched();
    // }

    // if(this.frmCtrlAcompaniamiento.value === 'NO' && this.edadPersona < 18){
    //   acompanianteValid = false;
    // }

    if(direccionesValid && contactoValid && procedenciaValid){
      return true;
    }
    else return false;
  }

  sendRequestFichaAdmision(){
    if(this.validarFicha()){
      this.status = 'loading';
      this._contactoService.getNumeroHistoria(this.idUnidadOperativaUser).subscribe((dataNum)=>{
        if (dataNum.code == 0) {
          this.numHistoria = dataNum.data;
          this._contactoService.registerFichaAsegurado(this.getRequestFicha()).subscribe((data)=>{
            if(data.code != 0){
              this._notificacionService.warning(data.message);
              this.status = 'failed';
            }
            else{
              this.solicitudesService.registerSolicitudAsegurado(this.getPayloadRegisterSolicitud()).subscribe((datos)=>{
                if (datos.code == 0) {
                  this._notificacionService.success('Se ha registrado con éxito la ficha de admisión');
                  this.router.navigate(['/app/afiliados']);
                  this.status = 'success';
                }
                else{
                  this._notificacionService.warning(datos.message);
                  this.status = 'failed';
                }
              })
            }
          })
        }
        else{
          this._notificacionService.warning(dataNum.message);
        }
      })
    }
    else{
      this.msgFaltante = true;
    }
  }
  showForm(){
    console.log('Request Ficha:')
    console.log(this.getRequestFicha())
  }

  getDatosFicha(): datosFicha{
    return{
      idUnidadOpe: this.idUnidadOperativaUser,
      numHistClinica: this.numHistoria,
      codRedAsistencial: this.dataRed.cod_RED,
      codCentro: this.dataRed.cod_CENTRO,
      observacion: this.frmCtrlObservacion.value,
      idUsuarioReg: this.idUserSession,
      activo: 1,
      direccion: this.getDataDirecciones(),
      datosContacto: this.getDataContacto(),
      datosProcedencia: this.getDataModalidadIngreso()
    }
  }

  
  getDataAsegurado(): datosAseguradoFicha{
    var dateParts = this.infoReniec.fecNacimiento.trim().split('/');

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
      codTipoAsegurado: this.dataSeguro.CONDICION[0],
      descTipoAsegurado: this.dataSeguro.CONDICION,
      codTipoSeguro: '0',
      descTipoSeguro: 'Seguro ' + this.dataSeguro.DGACTAS,
      codIpressAdscrip: this.dataRed.cod_CENTRO,
      nomIpressAdscrip: this.dataRed.nom_CENTRO,
      codRedAsisten: this.dataRed.cod_RED,
      nomRedAsisten: this.dataRed.des_RED,
      usuarioRegId: this.idUserSession,
      activo: 1,
      foto: this.imagenAdmision,
      fecFallecimiento:  this.feFallecimiento
    };
  }
  
  getDataContacto(): contactoFicha{
    return {
      telefono: this.formDatosContacto.value.frmTelefono!,
      celular: this.formDatosContacto.value.frmCelular!,
      tieneWhatsapp: this.formDatosContacto.value.frmWsp!,
      correo: this.formDatosContacto.value.frmCorreo!
    };
  }

  getRequestFicha(): registerFichaRequest{
    return{
      asegurado: this.getDataAsegurado(),
      fichaAdmision: this.getDatosFicha()
    }
  }

  getPayloadRegisterSolicitud(): RegisterSolicitud{
    var dataDireccionElegida = Object();
    this.getDataDirecciones().forEach((x)=>{
      if (x.activo == 1) {
        dataDireccionElegida = x;
      }
    })

    return{
      appOrigen: 'WEB_CAM',
      nombres: this.infoReniec.txtNombres,
      apePaterno: this.infoReniec.txtApepaterno,
      apeMaterno: this.infoReniec.txtApematerno,
      tipoDoc: this.parametroDocumento.valor1,
      tipoDocDesc: this.parametroDocumento.nombre,
      numDoc: this.numDoc,
      celular: this.formDatosContacto.value.frmCelular!,
      correo: this.formDatosContacto.value.frmCorreo!,
      direccion: dataDireccionElegida.direccion,
      ubigeoDireccion: `${dataDireccionElegida.codUbiDep}${dataDireccionElegida.codUbiProv}${dataDireccionElegida.codUbiDist}`,
      idUnidOpeCam: this.idUnidadOperativaUser,
      fecNacimiento: this.getDataAsegurado().fecNacimiento,
      codEstCivil: this.infoReniec.codEstcivil,
      descEstCivil: this.infoReniec.desEstadoCivil,
      codIpress: this.dataRed.cod_CENTRO,
      descIpress: this.dataRed.nom_CENTRO,
      textSolicitud: 'Necesito información sobre mi última consulta',
      usuarioRegId: this.idUserSession
    }
  }

}
