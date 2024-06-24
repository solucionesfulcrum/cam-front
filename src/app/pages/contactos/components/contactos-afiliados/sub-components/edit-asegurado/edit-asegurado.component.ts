import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { direccionFichaFront } from '@models/afiliados/ficha-solicitud.model';
import { Parametro } from '@models/parametros-busqueda.model';
import { NotificationService } from '@services/notification.service';
import { map } from 'rxjs';
import { ContactosAfiliadosService } from 'src/app/data/services/contactos/contactos-afiliados.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { DialogModalidadIngresoComponent } from '../dialog/dialog-modalidad-ingreso/dialog-modalidad-ingreso.component';
import { DialogNewDireccionComponent } from '../dialog/dialog-new-direccion/dialog-new-direccion.component';
import { EditAseguradoAfiliado, EditContactoAsegurado, EditDireccionesAsegurado, EditFichaAsegurado, EditModalidadAsegurado, EditProcedenciaAsegurado, RequestEditFicha } from '@models/afiliados/edit-ficha-solicitud';
import { RequestStatus } from '@models/request-status.model';

@Component({
  selector: 'esp-edit-asegurado',
  templateUrl: './edit-asegurado.component.html',
  styleUrls: ['./edit-asegurado.component.scss']
})
export class EditAseguradoComponent {
  dataShow = false;
  faSpinner = faSpinner;
  status: RequestStatus = 'init';
  
  idFicha: string = '';
  msgFaltante = false;
  idUnidOperativa = JSON.parse(localStorage.getItem('UnidElegida')!).idUnidOperativa;
  idUserSession = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario;
  dataFichaAfiliado: any = Object();
  edadPersona: number = 0;  
  
  listParamDocumento: Parametro[] = [];
  parametroDocumento!: Parametro;
  listParamDirecciones: Parametro[] = [];
  listParamModIngr: Parametro[] = [];

  // <!---------------------------------------------------- Segundo paso: Datos de direcciones                    --------------------------------------------------->
  
  frmCtrlDireccion = new FormControl(null);
  direccionesPersona: direccionFichaFront[] = [];
  direccionElegida: direccionFichaFront = Object();

  // <!---------------------------------------------------- Tercer paso:  Datos de Contacto                       --------------------------------------------------->
  
  formDatosContacto = this.fb.nonNullable.group({
    frmTelefono: [''],
    frmCelular: ['', [Validators.required,Validators.minLength(9)]],
    frmWsp: [null, Validators.required],
    frmCorreo: ['', [Validators.required,Validators.email]]
  });

  // <!---------------------------------------------------- Cuarto paso:  Datos de Procedencia                    --------------------------------------------------->

  modalidadIngresoData: any = {};
  frmCtrlModIngr = new FormControl(null);

  selectProcedenciaDerivOtro: string = '';
  datoProcedenciaDerivOtro: string = '';
  datosProcedenciaExtra: boolean = false;

  frmCtrlObservacion = new FormControl();


  constructor(private router                        : Router,
              private activeRoute                   : ActivatedRoute,
              private dialog                        : Dialog,
              private fb                            : FormBuilder,
              private aseguradoServices             : ContactosAfiliadosService,
              private datosGeneralesServices        : DatosGeneralesService,
              private notificationService           : NotificationService) { 
      this.idFicha = this.activeRoute.snapshot.paramMap.get('idFicha')!;
  }

  ngOnInit(): void {
    this.getDataFicha()
    // //console.log(this.idUserSession)
    this.frmCtrlDireccion.addValidators([Validators.required]);
    this.frmCtrlModIngr.addValidators([Validators.required]);
  }

  // <!---------------------------------------------------- Primer paso:  Datos del Asegurado                     --------------------------------------------------->
  getDataFicha(){
    this.aseguradoServices.obtenerFichaAsegurado(this.idFicha).subscribe((data) => {
      if (data.code == 0) {
        if (data.data.fichaAdmision.idUnidadOpe == this.idUnidOperativa) {
          this.dataFichaAfiliado = data.data;
          var dateObject = new Date(data.data.asegurado.fecNacimiento); 
          var timeDiff = Math.abs(Date.now() - dateObject.getTime());
          this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);

          this.getParametros();
          this.getDireccionDatos(data.data.fichaAdmision.direccion);
          this.setDataContactoFromService(data.data.fichaAdmision.datosContacto);
          this.setDatosProcedencia(data.data.fichaAdmision.datosProcedencia);
          this.frmCtrlObservacion.setValue(data.data.fichaAdmision.observacion);

          // //console.log(data.data)
        }
        else{
          this.notificationService.warning('Esta ficha no esta asignada a su unidad operativa');
        }
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  getParametros(){
    this.datosGeneralesServices.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data)=>{
      this.listParamDocumento = data.data;
      this.parametroDocumento = data.data.find((x) => x.valor1 == this.dataFichaAfiliado.asegurado.tipoDoc)!;

      this.dataShow = true;
    })
    this.datosGeneralesServices.getTipoParametros('MOD_INGRESO_ADMISION').pipe(map(msg => msg.data.sort((a1: Parametro, a2: Parametro) => parseInt(a1.valor1) - parseInt(a2.valor1)))).subscribe((data)=>{
      this.listParamModIngr = data;
    })
  }
  
  // <!---------------------------------------------------- Segundo paso: Datos de direcciones                    --------------------------------------------------->

  getDireccionDatos(direcciones: any){
    direcciones.map((dir: any, index: null) =>{
      
      let direccion: direccionFichaFront = Object();

      this.datosGeneralesServices.getTipoParametros('TIPO_DIRECCION').subscribe((data)=>{
        direccion.nomParametro = data.data.find((x: any)=>{return x.idParametros == dir.paramTipoId})!.nombre;
      })

      this.datosGeneralesServices.searchByUbigeo(dir.codUbiDep + dir.codUbiProv + dir.codUbiDist).subscribe((dataUbicacion)=>{
        if (dataUbicacion.code == 0) {
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
        }
        else{
          this.notificationService.warning(dataUbicacion.message);
        }
      })
      if(dir.activo == 1){
        this.direccionElegida = direccion;
        this.frmCtrlDireccion.setValue(index)
      }
      this.direccionesPersona.push(direccion);
    })
    this.frmCtrlDireccion.valueChanges.subscribe((data)=>{
      if(data!>=0){
        this.direccionesPersona.map(x=>{
          x.activo = 0
        });
        this.direccionesPersona[data!].activo = 1;
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
  // <!--------------------------------------------------------------------------------------------------------------------------------------------------------------->

  setDataContactoFromService(datosContacto: any){
    this.formDatosContacto.controls.frmCelular.setValue(datosContacto.celular);
    this.formDatosContacto.controls.frmCorreo.setValue(datosContacto.correo);
    this.formDatosContacto.controls.frmTelefono.setValue(datosContacto.telefono);
    this.formDatosContacto.controls.frmWsp.setValue(datosContacto.tieneWhatsapp);
  }

  // <!---------------------------------------------------- Cuarto paso:  Datos de Procedencia                    --------------------------------------------------->

  setDatosProcedencia(datosProcedencia: any){
    this.frmCtrlModIngr.setValue(datosProcedencia.paramModIngresoId)
    if(datosProcedencia.paramModIngresoId == 21 || datosProcedencia.paramModIngresoId == 22 || datosProcedencia.paramModIngresoId == 20){
      this.datosProcedenciaExtra = true;
      switch (datosProcedencia.paramModIngresoId) {
        case 21: 
          this.selectProcedenciaDerivOtro = 'IPRESS';
          this.datoProcedenciaDerivOtro = datosProcedencia.modalidadIngreso.nomIpres;
          this.modalidadIngresoData.cod_centro = datosProcedencia.modalidadIngreso.codIpres;
          this.modalidadIngresoData.nom_centro = datosProcedencia.modalidadIngreso.nomIpres;
          break;
        case 22:
          this.selectProcedenciaDerivOtro = 'CERPS';
          this.datoProcedenciaDerivOtro = datosProcedencia.modalidadIngreso.nomCerps;
          this.modalidadIngresoData.idUnidOperativa = datosProcedencia.modalidadIngreso.codCerps;
          this.modalidadIngresoData.nombre = datosProcedencia.modalidadIngreso.nomCerps;
          break;
        case 20:
          this.selectProcedenciaDerivOtro = 'CAM';
          this.datoProcedenciaDerivOtro = datosProcedencia.modalidadIngreso.nomCam;
          this.modalidadIngresoData.codigo = datosProcedencia.modalidadIngreso.codCam;
          this.modalidadIngresoData.nombre = datosProcedencia.modalidadIngreso.nomCam;
          break;
      }
    }
  }
  showDatosProcedencia(opt: number, modalidad: string){
    if (opt == 18 || opt == 19) {
      this.datosProcedenciaExtra = false;
    }
    else{
      let type: number = 0;
      let seleccion: string;
      switch (opt) {
        case 20: 
          type = 3;
          seleccion = 'CAM';
          break;
        case 21:
          type = 1;
          seleccion = 'IPRESS';
          break;
        case 22:
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
            // //console.log(this.modalidadIngresoData)
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

  showForm(){
    //console.log('Request Ficha:')
    //console.log(this.getRequestFicha())
  }
  
  getDatosFicha(): EditFichaAsegurado{
    return{
      idUnidadOpe: this.idUnidOperativa,
      codRedAsistencial: this.dataFichaAfiliado.fichaAdmision.codRedAsistencial,
      codCentro: this.dataFichaAfiliado.fichaAdmision.codCentro,
      observacion: this.frmCtrlObservacion.value,
      idUsuarioMod: this.idUserSession,
      direccion: this.getDataDirecciones(),
      datosContacto: this.getDataContacto(),
      datosProcedencia: this.getDataModalidadIngreso()
    }
  }
  
  getDataDirecciones(): EditDireccionesAsegurado[]{
    return this.direccionesPersona.map(x=>{
      let direccion: EditDireccionesAsegurado = Object();
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

  getDataModalidadIngreso(): EditProcedenciaAsegurado{
    let procedencia: EditProcedenciaAsegurado = Object();
    let modalidadExtra: EditModalidadAsegurado = Object();
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

  
  getDataAsegurado(): EditAseguradoAfiliado{

    return {
      tipDocIdent: this.parametroDocumento.valor1,
      descTipDocIdent: this.parametroDocumento.nombre,
      numDocIdent: this.dataFichaAfiliado.asegurado.numDoc,
      nombres: this.dataFichaAfiliado.asegurado.nombres,
      apePaterno: this.dataFichaAfiliado.asegurado.apePaterno,
      apeMaterno: this.dataFichaAfiliado.asegurado.apeMaterno,
      departNacim: this.dataFichaAfiliado.asegurado.departNacimiento,
      provinNacim: this.dataFichaAfiliado.asegurado.provinNacimiento,
      distriNacim: this.dataFichaAfiliado.asegurado.distriNacimiento,
      ubigeoNacim: this.dataFichaAfiliado.asegurado.ubigeoNacimiento,
      fecNacimiento: this.dataFichaAfiliado.asegurado.fecNacimiento, // yyyy-mm-dd with 0
      codEstCivil: this.dataFichaAfiliado.asegurado.codEstCivil,
      descEstCivil: this.dataFichaAfiliado.asegurado.descEstCivil,
      codSexo: this.dataFichaAfiliado.asegurado.codSexo,
      descSexo: this.dataFichaAfiliado.asegurado.descSexo,
      codTipoAsegurado: this.dataFichaAfiliado.asegurado.codTipoAsegurado,
      descTipoAsegurado: this.dataFichaAfiliado.asegurado.descTipoAsegurado,
      codTipoSeguro: this.dataFichaAfiliado.asegurado.codTipoSeguro,
      descTipoSeguro: this.dataFichaAfiliado.asegurado.descTipoSeguro,
      codIpressAdscrip: this.dataFichaAfiliado.asegurado.codIpressAdscripcion,
      nomIpressAdscrip: this.dataFichaAfiliado.asegurado.nomIpressAdscrip,
      codRedAsisten: this.dataFichaAfiliado.asegurado.codRedAsisten,
      nomRedAsisten: this.dataFichaAfiliado.asegurado.nomRedAsisten,
      usuarioModId: this.idUserSession,
      foto: this.dataFichaAfiliado.asegurado.foto,
      fecFallecimiento:  null!
    };
  }
  getDataContacto(): EditContactoAsegurado{
    return {
      telefono: this.formDatosContacto.value.frmTelefono!,
      celular: this.formDatosContacto.value.frmCelular!,
      tieneWhatsapp: this.formDatosContacto.value.frmWsp!,
      correo: this.formDatosContacto.value.frmCorreo!
    };
  }

  getRequestFicha(): RequestEditFicha{
    return{
      asegurado: this.getDataAsegurado(),
      fichaAdmision: this.getDatosFicha()
    }
  }

  validarFicha(): boolean{
    let direccionesValid = false;
    // //console.log(this.formDatosContacto.get('frmCelular')!.errors)
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
      this.aseguradoServices.editFichaAsegurado(this.idFicha, this.getRequestFicha()).subscribe((data)=>{
        if(data.code != 0){
          this.notificationService.warning(data.message);
          this.status = 'failed';
        }
        else{
          this.notificationService.success('Se han realizado los cambios');
          this.router.navigate(['/app/contactos/show/' + this.idFicha]);
          this.status = 'success';
        }
      })
    }
    else{
      this.msgFaltante = true;
    }
  }

}
