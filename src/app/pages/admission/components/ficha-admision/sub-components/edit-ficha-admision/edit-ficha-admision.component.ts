import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdmisionFichaService } from '@services/admision/admision-ficha.service';
import { DialogNewDireccionComponent } from '../postulacion-ficha-admision/dialogs/dialog-new-direccion/dialog-new-direccion.component';
import { Dialog } from '@angular/cdk/dialog';
import { DialogDataAcompanianteComponent } from '../postulacion-ficha-admision/dialogs/dialog-data-acompaniante/dialog-data-acompaniante.component';
import { DialogModalidadIngresoComponent } from '../postulacion-ficha-admision/dialogs/dialog-modalidad-ingreso/dialog-modalidad-ingreso.component';
import { DatosGeneralesService } from '@services/datos-generales.service';
import { Parametro } from '@models/parametros-busqueda.model';
import { map } from 'rxjs';
import { acompanianteFicha, contactoFicha, datosFicha, direccionFicha, modalidadIngreso, procedenciaFicha } from '@models/admision/ficha-admision.model';
import { DatosAseguradoFichaResponse, DatosFichaResponse } from '@models/admision/ficha-admision-response.model';
import { AcompanianteData, direccionFichaFront } from '@models/admision/ficha-datos-adicionales.model';
import { EditAcompanianteAdmision, EditAseguradoAdmision, EditFichaAdmision, EditModalidadAdmision, EditProcedenciaAdmision, RequestEditFicha } from '@models/admision/edit-ficha-admision.model';
import { dataPersonaResponse } from '@models/admision/datos-persona.model';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@services/notification.service';
import { RequestStatus } from '@models/request-status.model';

@Component({
  selector: 'esp-edit-ficha-admision',
  templateUrl: './edit-ficha-admision.component.html',
  styleUrls: ['./edit-ficha-admision.component.scss']
})
export class EditFichaAdmisionComponent {
  
  status: RequestStatus = 'init';

  listParamDocumento: Parametro[] = [];
  listParamDirecciones: Parametro[] = [];
  listParamModIngr: Parametro[] = [];

  dataFicha: any = [''];
  dataAsegurado: any = [''];
  idFicha: string;

  selectProcedenciaDerivOtro: string = '';
  datoProcedenciaDerivOtro: string = '';
  datosProcedenciaExtra: boolean = false;
  selectSi = false;
  selectNo = false;

  idUnidadOperativaUser = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;
  idUserSession = (JSON.parse(localStorage.getItem('sigpsUser')!)).idUsuario;
  faSpinner = faSpinner;
  wait = false;
  msgFaltante = false ;

  infoReniec: any = Object();
  // <!---------------------------------------------------- Primer paso:  Datos del Asegurado                     --------------------------------------------------->

  edadPersona: number = 0;
  dataSeguro: any = [''];
  dataPersona!: dataPersonaResponse;
  dataPersonal: any = [''];
  dataAfiliado: any = [''];
  dataRed: any = [''];
  imagenAdmision: string = '';


  // <!---------------------------------------------------- Segundo paso: Datos de direcciones                    --------------------------------------------------->
  
  frmCtrlDireccion = new FormControl(null);
  direccionesPersona: direccionFichaFront[] = [];
  direccionElegida: direccionFichaFront = Object();

  // <!---------------------------------------------------- Tercer paso:  Datos de Contacto                       --------------------------------------------------->
  
  formDatosContacto = this.fb.nonNullable.group({
    frmTelefono: ['', [Validators.required,Validators.minLength(7)]],
    frmCelular: ['', [Validators.required,Validators.minLength(9)]],
    frmWsp: [null, Validators.required],
    frmCorreo: ['', [Validators.required,Validators.email]]
  });

  // <!---------------------------------------------------- Cuarto paso:  Datos de Procedencia                    --------------------------------------------------->

  modalidadIngresoData: any = {};
  frmCtrlModIngr = new FormControl(null);

  // <!---------------------------------------------------- Quinto paso: Datos del acompañante y Observación      --------------------------------------------------->

  requiereApoyo: boolean = false;

  frmCtrlAcompaniamiento = new FormControl(null);
  listParamRelacion: Parametro[] = [];
  frmCtrlObservacion = new FormControl();

  acompanianteData: EditAcompanianteAdmision = Object();

  public formApoyo = this.fb.nonNullable.group({
    frmSelectParentesco:[''],
    frmSelectDoc:[''],
    frmDoc:[undefined],
    frmNombres:[undefined],
    frmApellidos:[undefined],
    frmCelular:[undefined]
  });

  // <!-------------------------------------------------------------------------------------------------------------------------------------------------------------->
  constructor(private dialog : Dialog,
              private activeRoute: ActivatedRoute,
              private fb: FormBuilder,
              private datosService: DatosGeneralesService,
              private _notification: NotificationService,
              private router: Router,
              private _admissionService: AdmisionFichaService) {
      this.idFicha = this.activeRoute.snapshot.paramMap.get('id')!;            
    }
  ngOnInit(): void {
    // this.idUnidadOperativaUser = (JSON.parse(localStorage.getItem('sigpsUser')!)).idUnidOperativa;
    // this.idUserSession = (JSON.parse(localStorage.getItem('sigpsUser')!)).idUsuario;
    this.cargaServiciosParametros();
    this._admissionService.getFicha(this.idFicha).subscribe((data : any)=>{
      console.log(data)
      const dataObj = Object(data);
      this.dataFicha = dataObj.data.fichaAdmision;
      this.dataAsegurado = dataObj.data.asegurado
      var dateParts = this.dataAsegurado.fecNacimiento.split("-");
      var dateObject = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[1]); 
      var timeDiff = Math.abs(Date.now() - dateObject.getTime());
      this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
      //Obtener datos de direccion reniec
      
      this.get50ServiciosDatos(this.dataAsegurado.tipoDoc,this.dataAsegurado.numDoc);
      this.getDireccionDatos(this.dataFicha.direccion);
      this.setDataContactoFromService(this.dataFicha.datosContacto);
      this.setDatosProcedencia(this.dataFicha.datosProcedencia);
      this.setDatosAcompaniante(this.dataFicha.datosAcompaniante);

      this.frmCtrlObservacion.setValue(this.dataFicha.observacion);
      // console.log(data);
      this.frmCtrlDireccion.addValidators([Validators.required]);
      this.frmCtrlModIngr.addValidators([Validators.required]);
      this.frmCtrlAcompaniamiento.addValidators([Validators.required]);
    });
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
    })
    this.datosService.getTipoParametros('PARENTESCO').subscribe((data)=>{
      this.listParamRelacion = data.data;
    })
  }
  // <!---------------------------------------------------- Primer paso:  Datos del Asegurado                     --------------------------------------------------->

  get50ServiciosDatos(tipoDocumento: string, numeroDocumento: string){
    this._admissionService.getDatoSeguro(tipoDocumento,numeroDocumento).subscribe((data)=>{
      // console.log(data)
      this.dataSeguro = Object(data.response[0]);
    })
    this._admissionService.searchAndFindData({codOpcion: '1', tipoDoc: tipoDocumento, numDoc: numeroDocumento }).subscribe((data : any)=>{
      this.dataPersonal = data.data.dataPersona;
      this.dataAfiliado = data.data.dataAfiliado[0];
      this.datosService.getRedesAsistenciales().subscribe((datos)=>{
        this.dataRed = datos.response.find((x: any)=> {return x.cod_CENTRO  === this.dataAfiliado.codCentro});
      })
    });

    // this._admissionService.getInformacionPersona((`0${tipoDocumento}`).slice(-2), numeroDocumento).subscribe((data)=>{
    //   if (data.status === 'success') {
    //     this.infoReniec = data.data;
    //     var dateParts = this.infoReniec.fecNacimiento.trim().split('/');
    //     var dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]); 
    //     var timeDiff = Math.abs(Date.now() - dateObject.getTime());
    //     this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    //   }
    //   else{
    //     this._notification.warning(data.mensaje);
    //   }
    // });
    this._admissionService.getImgPersona((`0${tipoDocumento}`).slice(-2), numeroDocumento).subscribe((data)=>{
      if (data.code == 0) {
        this.infoReniec = data.data.data;
        this.imagenAdmision = data.data.data.fotoBase64;
        var dateParts = this.infoReniec.fecNacimiento.trim().split('/');
        var dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]); 
        var timeDiff = Math.abs(Date.now() - dateObject.getTime());
        this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);

        this.wait = true;
      }
      else{
        this._notification.warning(data.message);
      }
    })
  }

  // <!---------------------------------------------------- Segundo paso: Datos de direcciones                    --------------------------------------------------->

  getDireccionDatos(direcciones: any){
    direcciones.map((dir: any, index: null) =>{
      
      let direccion: direccionFichaFront = Object();

      this.datosService.getTipoParametros('TIPO_DIRECCION').subscribe((data)=>{
        direccion.nomParametro = data.data.find((x: any)=>{return x.idParametros == dir.paramTipoId})!.nombre;
      })

      this.datosService.searchByUbigeo(dir.codUbiDep + dir.codUbiProv + dir.codUbiDist).subscribe((dataUbicacion)=>{
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
          this._notification.warning(dataUbicacion.message);
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
  setDataContactoFromService(datosContacto: any){
    this.formDatosContacto.controls.frmCelular.setValue(datosContacto.celular);
    this.formDatosContacto.controls.frmCorreo.setValue(datosContacto.correo);
    this.formDatosContacto.controls.frmTelefono.setValue(datosContacto.telefono);
    this.formDatosContacto.controls.frmWsp.setValue(datosContacto.tieneWhatsapp);
  }

  getDataContacto(): contactoFicha{
    return {
      telefono: this.formDatosContacto.value.frmTelefono!,
      celular: this.formDatosContacto.value.frmCelular!,
      tieneWhatsapp: this.formDatosContacto.value.frmWsp!,
      correo: this.formDatosContacto.value.frmCorreo!
    };
  }

  // <!---------------------------------------------------- Cuarto paso:  Datos de Procedencia                    --------------------------------------------------->

  setDatosProcedencia(datosProcedencia: any){
    this.frmCtrlModIngr.setValue(datosProcedencia.paramModIngresoId)
    if(datosProcedencia.paramModIngresoId == 5 || datosProcedencia.paramModIngresoId == 6 || datosProcedencia.paramModIngresoId == 1){
      this.datosProcedenciaExtra = true;
      switch (this.dataFicha.datosProcedencia.paramModIngresoId) {
        case 1: 
          this.selectProcedenciaDerivOtro = 'IPRESS';
          this.datoProcedenciaDerivOtro = datosProcedencia.modalidadIngreso.nomIpres;
          this.modalidadIngresoData.ubigeo = datosProcedencia.modalidadIngreso.codIpres;
          this.modalidadIngresoData.establecimiento = datosProcedencia.modalidadIngreso.nomIpres;
          break;
        case 5:
          this.selectProcedenciaDerivOtro = 'CERPS';
          this.datoProcedenciaDerivOtro = datosProcedencia.modalidadIngreso.nomCerps;
          this.modalidadIngresoData.idUnidOperativa = datosProcedencia.modalidadIngreso.codCerps;
          this.modalidadIngresoData.nombre = datosProcedencia.modalidadIngreso.nomCerps;
          break;
        case 6:
          this.selectProcedenciaDerivOtro = 'MBRPS';
          this.datoProcedenciaDerivOtro = datosProcedencia.modalidadIngreso.nomMbrps;
          this.modalidadIngresoData.idUnidOperativa = datosProcedencia.modalidadIngreso.codMbrps;
          this.modalidadIngresoData.nombre = datosProcedencia.modalidadIngreso.nomMbrps;
          break;
      }
    }
  }

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

  getDataModalidadIngreso(): EditProcedenciaAdmision{
    let procedencia: EditProcedenciaAdmision = Object();
    let modalidadExtra: EditModalidadAdmision = Object();
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

  setDatosAcompaniante(datosAcompaniante: any){
    // console.log(datosAcompaniante)
    this.frmCtrlAcompaniamiento.setValue(datosAcompaniante.requiereApoyo)
    if(datosAcompaniante.requiereApoyo === 'SI'){
      this.requiereApoyo = true;

      this.acompanianteData.paramParentescoId = datosAcompaniante.paramParentescoId;
      this.acompanianteData.paramTipoDocId = datosAcompaniante.paramTipoDocId;
      this.acompanianteData.nroDocumento = datosAcompaniante.nroDocumento;
      this.acompanianteData.nombres = datosAcompaniante.nombres;
      this.acompanianteData.apellidos = datosAcompaniante.apellidos;
      this.acompanianteData.telefono = datosAcompaniante.telefono;
      this.acompanianteData.correo = datosAcompaniante.correo;
      this.acompanianteData.celular = datosAcompaniante.celular;
      this.acompanianteData.tieneWhatsapp = datosAcompaniante.tieneWhatsapp;

      this.formApoyo.value.frmSelectParentesco = this.listParamRelacion.find((x)=>{return x.idParametros == datosAcompaniante.paramParentescoId})!.nombre;
      this.formApoyo.value.frmSelectDoc = datosAcompaniante.paramTipoDocId == 25? 'DNI' : this.listParamDocumento.find((x)=>{return x.idParametros == datosAcompaniante.paramTipoDocId})!.nombre;
      this.formApoyo.value.frmDoc = datosAcompaniante.nroDocumento;
      this.formApoyo.value.frmNombres = datosAcompaniante.nombres;
      this.formApoyo.value.frmApellidos = datosAcompaniante.apellidos;
      this.formApoyo.value.frmCelular = datosAcompaniante.celular;
    }
  }

  showDataAcompaniante(opt: number){
    if (opt == 1 && this.requiereApoyo == false) {
      const dialogRef = this.dialog.open(DialogDataAcompanianteComponent,{
        width:'45%',
        data:{ }
      })
      dialogRef.closed.subscribe(data =>{
        const dataObj = Object(data)
        if(dataObj.siEnvia){
          // console.log(data)
          this.requiereApoyo = true;
          this.acompanianteData.paramParentescoId = parseInt(dataObj.parentesco);
          this.acompanianteData.paramTipoDocId = parseInt(dataObj.tipoDoc);
          this.acompanianteData.nroDocumento = dataObj.nroDoc;
          this.acompanianteData.nombres = dataObj.nombres;
          this.acompanianteData.apellidos = dataObj.apellidos;
          this.acompanianteData.telefono = dataObj.telefono;
          this.acompanianteData.correo = dataObj.correo;
          this.acompanianteData.celular = dataObj.celular;
          this.acompanianteData.tieneWhatsapp = dataObj.wsp;

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

  getDataAcompaniante(): EditAcompanianteAdmision{
    if(this.frmCtrlAcompaniamiento.value === 'SI'){
      return {
        requiereApoyo: this.frmCtrlAcompaniamiento.value!,
        paramParentescoId: this.acompanianteData.paramParentescoId,
        paramTipoDocId: this.acompanianteData.paramTipoDocId,
        nroDocumento: this.acompanianteData.nroDocumento,
        nombres: this.acompanianteData.nombres,
        apellidos: this.acompanianteData.apellidos,
        telefono: this.acompanianteData.telefono,
        celular: this.acompanianteData.celular,
        tieneWhatsapp: this.acompanianteData.tieneWhatsapp,
        correo: this.acompanianteData.correo
      }
    }
    else{
      return {
        requiereApoyo: this.frmCtrlAcompaniamiento.value!,
      }
    }
  }
  sendRequestFichaAdmision(){
    this.status = 'loading';
    // console.log(this.validarFicha())
    if(this.validarFicha()){
      // console.log(this.getRequestEdit())
      this._admissionService.editFichaAdmision(this.idFicha, this.getRequestEdit()).subscribe((data)=>{
        // console.log(data);
        if(data.code != 0){
          this._notification.error(data.message);
          // console.log(data.message)
        }
        else{
          this._notification.success('Se han realizado los cambios');
          this.router.navigate(['/app/admission/'+this.idFicha]);
        }
        this.status = 'success';
      })
    }
    else{
      this.msgFaltante = true;
      this.status = 'success';
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

  
  showForm(){
    console.log('Request Ficha:')
    console.log(this.getRequestEdit())
  }

  getRequestEdit():RequestEditFicha{
    return{
      asegurado: this.getDatosAsegurado(),
      fichaAdmision: this.getDatosFicha()
    }
  }

  getDatosAsegurado():EditAseguradoAdmision{
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
    
    return{
      tipDocIdent: this.dataAsegurado.tipoDoc,
      descTipDocIdent: this.dataAsegurado.descTipoDoc,
      numDocIdent: this.dataAsegurado.numDoc,
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
      codTipoAsegurado: this.dataSeguro.CONDICION[0],
      descTipoAsegurado: this.dataSeguro.CONDICION,
      // codTipoSeguro: this.dataSeguro.CODIGO_TIPOSEGURO, // CAMBIAR LUEGO DE TENER ESTE DATO EN PROD
      codTipoSeguro: '0',
      descTipoSeguro: 'Seguro ' + this.dataSeguro.DGACTAS,
      codIpressAdscrip: this.dataAfiliado.codCentro,
      nomIpressAdscrip: this.dataAfiliado.desCentro,
      codRedAsisten: this.dataRed.cod_RED,
      nomRedAsisten: this.dataRed.des_RED,
      usuarioModId: this.idUserSession, 
      // foto: tempPhotoBase64,
      foto: this.imagenAdmision,
      fecFallecimiento:  this.dataPersonal.fefallecid
    }
  }

  getDatosFicha(): EditFichaAdmision{
    return{
      idUnidadOpe: this.idUnidadOperativaUser,
      codRedAsistencial: this.dataAsegurado.codRedAsisten,
      codCentro: this.dataAsegurado.codIpressAdscripcion,
      observacion: this.frmCtrlObservacion.value,
      idUsuarioMod: this.idUserSession,
      direccion: this.getDataDirecciones(),
      datosContacto: this.getDataContacto(),
      datosProcedencia: this.getDataModalidadIngreso(),
      datosAcompaniante: this.getDataAcompaniante()
    }
  }
}
