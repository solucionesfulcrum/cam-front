import { CommonModule } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { Parametro, ParametroProfesion } from '@models/parametros-busqueda.model';
import { data } from 'autoprefixer';
import { ubicacionGeo } from '@models/admision/ficha-admision.model';
import { Observable, map, startWith } from 'rxjs';
import { RequestChangePassword, RequestDatosFormacionRegistro, RequestDatosPersonalesRegistro, changePassword } from '@models/dashboard/dashboard.model';
import { NotificationService } from '@services/notification.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'esp-edit-active-user',
  templateUrl: './edit-active-user.component.html',
  styleUrls: ['./edit-active-user.component.scss']
})

export class EditActiveUserComponent {
  opcionesGenero: Parametro[] = [];
  opcionesEstadoCivil: Parametro[] = [];
  opcionesNacionalidad: any[] = [];
  opcionesNivelEducativo: Parametro[] = [];
  opcionesProfesion: ParametroProfesion[] = [];

  isImageFotoUpdate = false;
  applicationFile: any;
  nombreFoto = null;
  retrievedFoto: any;
  isFotoUpdate = false;

  isImageFotoUpdateFirma = false;
  applicationFileFirma: any;
  nombreFotoFirma = null;
  retrievedFotoFirma: any;
  isFotoUpdateFirma = false;

  nombreCompleto = '';
  ubicacionSeleccionadaTmp!: ubicacionGeo;
  nacionalidadSeleccionadaTmp: any;
  listUbicaciones: ubicacionGeo[] = [];
  filteredOptions!: Observable<ubicacionGeo[]>;
  yearsGrad: Number[] = [];
  numDocumento = '';
  imagenFirma: any = null;
  imagenFoto: any = null;

  valid = false;

  public formDatosPersonales = this.fb.nonNullable.group({
    frmNombres: [''],
    frmApellidos: [''],
    frmCelular: [''],
    frmCorreo: [''],
    frmDireccion: [''],
    frmFechNacimiento: ['', [Validators.required]],
    frmGenero: [''],
    frmEstadoCivil: [''],
    frmNacionalidad: [''],
    frmTipoDoc: [''],
    frmNumDoc: [''],
    frmProfesion: ['', [Validators.required]],
    frmColegiatura: [''],
    frmEspecialidad: [''],
  });


  public formDatosFormacion = this.fb.nonNullable.group({
    frmNivelEstudio: ['', [Validators.required]],
    frmInstEduca: ['', [Validators.required]],
    frmAnioGraduacion: ['', [Validators.required]],
  });

  public formDatosSeguridad = this.fb.nonNullable.group({
    frmContraActual: ['', [Validators.required]],
    frmNuevaContra: ['', [Validators.required]],
    frmRepNuevaContra: ['', [Validators.required]],
  });

  frmCtrlNacionalidad = new FormControl();

  distrControl = new FormControl();

  constructor(private fb: FormBuilder, private datosService: DatosGeneralesService, private notificationService: NotificationService, @Inject(LOCALE_ID) private locale: string,) {

  }

  rangeYear() {
    const max = new Date().getFullYear()
    const min = max - 100
    //const years = []

    for (let i = max; i >= min; i--) {
      this.yearsGrad.push(i)
    }
    return this.yearsGrad
  }

  grabarDatosPersonales() {
    this.valid = false
    if (this.formDatosPersonales.valid && this.distrControl.value.codUbigeo != 0) {
      this.datosService.registerDatosPersonales(this.getPayloadRegistro()).subscribe((data) => {
        if (data.code == 0) {
          if (this.applicationFile) {
            const formData = new FormData();
            formData.append('img-foto', this.applicationFile);
            const idUsuario = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario
            this.datosService.saveFileImagenFoto(formData, idUsuario).subscribe((datos) => {
              console.log(datos)
              this.notificationService.success('¡Se guardaron los datos personales!');
            })
          }
          if (this.applicationFileFirma) {
            const formDataFirma = new FormData();
            formDataFirma.append('img-firma', this.applicationFileFirma);
            const idUsuario = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario
            this.datosService.saveFileImagenFirma(formDataFirma, idUsuario).subscribe((datos) => {
              console.log(datos)
              this.notificationService.success('¡Se guardaron los datos personales!');
            })
          }
          this.notificationService.success('¡Se guardaron los datos personales!');
          //this.router.navigate(['app/adm-uo'])
        }
        else {
          this.notificationService.warning(data.message);
        }
      })
    } else {
      this.formDatosPersonales.markAllAsTouched();
      this.distrControl.markAllAsTouched();
      this.valid = true
      console.log("valid", this.valid)
    }
  }

  grabarDatosSeguridad() {
    this.datosService.loginChangePassword(this.getPayloadLoginChangePasswoard()).subscribe((data) => {
      if (data.code == 0) {
        const auth = data.data.accessToken
        const guiid = data.data.id
        this.datosService.changePassword(this.getPayloadChangePasswoard(guiid), auth).subscribe((data) => {
          if (data.code == 0) {
            this.notificationService.success(data.message);
          } else {
            this.notificationService.warning(data.message);
          }
        })
        //this.notificationService.success('¡Se guardaron los datos personales!');
        //this.router.navigate(['app/adm-uo'])
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

  grabarDatosFormacion() {
    console.log('datos', this.formDatosFormacion.value.frmAnioGraduacion)
    this.datosService.registerDatosFormacion(this.getPayloadRegistroFormacion()).subscribe((data) => {
      if (data.code == 0) {
        this.notificationService.success('¡Se guardaron los datos personales!');
        //this.router.navigate(['app/adm-uo'])
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }

  ngOnInit() {
    this.rangeYear()
    this.formDatosPersonales.controls.frmCorreo.disable();
    this.formDatosPersonales.controls.frmTipoDoc.disable();
    this.formDatosPersonales.controls.frmNumDoc.disable();

    this.datosService.getTipoParametros('GENERO').subscribe((data) => {
      this.opcionesGenero = data.data;
    });
    this.datosService.getTipoParametros('ESTADO_CIVIL').subscribe((data) => {
      this.opcionesEstadoCivil = data.data;
    });
    this.datosService.getObtenerNacionalidad('E').subscribe((data) => {

      this.opcionesNacionalidad = data.data;
    });
    this.datosService.getTipoParametros('NIVEL_EDUCATIVO').subscribe((data) => {

      this.opcionesNivelEducativo = data.data;
    });
    this.datosService.getProfesion().subscribe((data) => {
      this.opcionesProfesion = data.data;
    });

    const idUsuarioTemp = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario

    this.datosService.getObtenerDatos(idUsuarioTemp).subscribe((data) => {
      console.log("datos personales", data.data)
      this.imagenFirma = data.data.datosPersonales.firmaImg
      this.imagenFoto = data.data.datosPersonales.fotoPerfilImg
      console.log("imagenFirma", this.imagenFirma)
      this.numDocumento = data.data.datosPersonales.numeroDocumento;
      this.nombreCompleto = data.data.datosPersonales.nombres + " " + data.data.datosPersonales.apellidos;
      this.formDatosPersonales.controls.frmNombres.setValue(data.data.datosPersonales.nombres)
      this.formDatosPersonales.controls.frmApellidos.setValue(data.data.datosPersonales.apellidos)
      this.formDatosPersonales.controls.frmCelular.setValue(data.data.datosPersonales.celular)
      this.formDatosPersonales.controls.frmCorreo.setValue(data.data.datosPersonales.email)
      this.formDatosPersonales.controls.frmDireccion.setValue(data.data.datosPersonales.direccion)
      this.formDatosPersonales.controls.frmTipoDoc.setValue(data.data.datosPersonales.tipoDocumento)
      this.formDatosPersonales.controls.frmEstadoCivil.setValue(data.data.datosPersonales.paramEstadoCivilId)
      this.formDatosPersonales.controls.frmGenero.setValue(data.data.datosPersonales.paramGeneroId)
      this.formDatosPersonales.controls.frmNumDoc.setValue(data.data.datosPersonales.numeroDocumento)
      this.formDatosPersonales.controls.frmFechNacimiento.setValue(data.data.datosPersonales.fechaNacimiento)
      this.formDatosFormacion.controls.frmNivelEstudio.setValue(data.data.datosFormacionProf.paramNivelEducativoId)
      this.formDatosFormacion.controls.frmInstEduca.setValue(data.data.datosFormacionProf.nombreInstitucion)
      this.formDatosFormacion.controls.frmAnioGraduacion.setValue(data.data.datosFormacionProf.anioGraduacion)
      this.formDatosPersonales.controls.frmProfesion.setValue(data.data.datosPersonales.idProfesion)
      this.formDatosPersonales.controls.frmColegiatura.setValue(data.data.datosPersonales.cmp)
      this.formDatosPersonales.controls.frmEspecialidad.setValue(data.data.datosPersonales.rne)
      this.frmCtrlNacionalidad.setValue({ descripcion: data.data.datosPersonales.descNacionalidad })
      this.nacionalidadSeleccionadaTmp = data.data.datosPersonales.descNacionalidad
      this.distrControl.setValue({ nombreUbicacion: data.data.datosPersonales.descUbigeo, codUbigeo: data.data.datosPersonales.codUbiDep + data.data.datosPersonales.codUbiProv + data.data.datosPersonales.codUbiDist, codUbiDep: data.data.datosPersonales.codUbiDep, codUbiProv: data.data.datosPersonales.codUbiProv, codUbiDistr: data.data.datosPersonales.codUbiDist })
    })


    this.getUbicaciones();
    this.distrControl.valueChanges.pipe(startWith(''), map(value => typeof value === 'string' ? value : value.codUbigeo)).subscribe((dataValue) => {
      if (dataValue) {
        this.datosService.searchByUbigeo(dataValue).subscribe((data) => {
          if (data) {
            this.ubicacionSeleccionadaTmp = { nombreUbicacion: data.data.distrito + ' - ' + data.data.provincia + ' - ' + data.data.region, codUbigeo: data.data.codigo, codUbiDep: data.data.codigo.match(/.{1,2}/g)[0], codUbiProv: data.data.codigo.match(/.{1,2}/g)[1], codUbiDistr: data.data.codigo.match(/.{1,2}/g)[2] }
          }
        })
      }

    })
    this.filteredOptions = this.distrControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.nombreUbicacion),
      map(nombreUbicacion => nombreUbicacion ? this._filter(nombreUbicacion) : this.listUbicaciones.slice())
    );

    this.frmCtrlNacionalidad.valueChanges.pipe(startWith(''), map(value => typeof value === 'string' ? value : value.descripcion)).subscribe((data) => {
      if (data) {
        this.datosService.getObtenerNacionalidad(data).subscribe((data) => {
          this.opcionesNacionalidad = data.data;
        });
      }

    })
  }
  //Imagenes-----------
  onChangeFileFotoFirma(files: any) {
    console.log("hola mundo", files)
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/(jpeg|png)$/) == null) {
      this.notificationService.warning(
        'Por favor seleccione una Imagen Valida formato PNG o JPEG'
      );
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
      const fileApp = files[0];
      this.applicationFileFirma = files[0];
      if (fileApp.size >= 1048576) {
        this.notificationService.warning('Tamaño de archivo excedido, máximo 1MB');
        return;
      }
      else {
      }
      this.nombreFotoFirma = files[0].name;
      this.retrievedFotoFirma = reader.result;
      console.log(this.applicationFile)
      this.isFotoUpdateFirma = true;
    };
  }

  onChangeFileFoto(files: any) {
    console.log("hola mundo", files)
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/(jpeg|png)$/) == null) {
      this.notificationService.warning(
        'Por favor seleccione una Imagen Valida formato PNG o JPEG'
      );
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
      const fileApp = files[0];
      this.applicationFile = files[0];
      if (fileApp.size >= 1048576) {
        this.notificationService.warning('Tamaño de archivo excedido, máximo 1MB');
        return;
      }
      else {
      }
      this.nombreFoto = files[0].name;
      this.retrievedFoto = reader.result;
      console.log(this.applicationFile)
      this.isFotoUpdate = true;
    };
  }

  actualizarDate(input: any, opt: number) {
    if (input) {
      switch (opt) {
        case 1:
          this.formDatosPersonales.controls.frmFechNacimiento.setValue(input)
          break;
        case 2:
          this.formDatosPersonales.controls.frmFechNacimiento.setValue(input)
          break;
      }
    }
  }
  getPayloadRegistro(): RequestDatosPersonalesRegistro {
    let fechaNacimiento = this.formDatosPersonales.value.frmFechNacimiento
    return {
      idUsuario: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario,
      nombres: this.formDatosPersonales.value.frmNombres!,
      apellidos: this.formDatosPersonales.value.frmApellidos!,
      celular: this.formDatosPersonales.value.frmCelular!,
      codUbiDep: this.ubicacionSeleccionadaTmp.codUbiDep,
      codUbiProv: this.ubicacionSeleccionadaTmp.codUbiProv,
      codUbiDist: this.ubicacionSeleccionadaTmp.codUbiDistr,
      direccion: this.formDatosPersonales.value.frmDireccion!,
      fechaNacimiento: formatDate(fechaNacimiento!.split('/')[2] + '/' + fechaNacimiento!.split('/')[1] + '/' + fechaNacimiento!.split('/')[0], 'yyyy-MM-dd', this.locale),
      paramEstadoCivilId: parseInt(this.formDatosPersonales.value.frmEstadoCivil!),
      paramGeneroId: parseInt(this.formDatosPersonales.value.frmGenero!),
      idNacionalidad: 0,
      descNacionalidad: this.nacionalidadSeleccionadaTmp,
      idProfesion: parseInt(this.formDatosPersonales.value.frmProfesion!),
      rne: this.formDatosPersonales.value.frmEspecialidad!,
      cmp: this.formDatosPersonales.value.frmColegiatura!,
      descUbigeo: this.ubicacionSeleccionadaTmp.nombreUbicacion
    }
  }

  getPayloadRegistroFormacion(): RequestDatosFormacionRegistro {
    return {
      idUsuario: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario,
      paramNivelEducativoId: parseInt(this.formDatosFormacion.value.frmNivelEstudio!),
      nombreInstitucion: this.formDatosFormacion.value.frmInstEduca!,
      anioGraduacion: parseInt(this.formDatosFormacion.value.frmAnioGraduacion!)
    }
  }

  getPayloadLoginChangePasswoard(): RequestChangePassword {
    return {
      username: this.numDocumento,
      password: this.formDatosSeguridad.value.frmContraActual!
    }
  }

  getPayloadChangePasswoard(guiid: string): changePassword {
    return {
      guiid: guiid,
      currentPwd: this.formDatosSeguridad.value.frmContraActual!,
      newPwd: this.formDatosSeguridad.value.frmNuevaContra!,
      confirmNewPwd: this.formDatosSeguridad.value.frmRepNuevaContra!,
    }
  }

  //Nacionalidad ------------
  displayFnNacionalidad(selectedoption: any) {
    return selectedoption ? selectedoption.descripcion : undefined;
  }

  onSelectionChangeNacional(event: any) {
    this.nacionalidadSeleccionadaTmp = event.option.value.descripcion;
  }
  // Ubicacion------------
  displayFnUbicacion(selectedoption: any) {
    return selectedoption ? selectedoption.nombreUbicacion : undefined;
  }

  onSelectionChangeJefe(event: any) {
    this.ubicacionSeleccionadaTmp = event.option.value;
  }


  private _filter(value: string): ubicacionGeo[] {

    if (value != undefined) {
      const filterValue = value.toLowerCase();
      return this.listUbicaciones.filter(option => option.nombreUbicacion.toLowerCase().includes(filterValue));
    }
    return this.listUbicaciones
  }

  async getUbicaciones() {
    await this.datosService.getDepartamentosReniec().subscribe((data) => {
      data.data.forEach((element: any) => {
        this.datosService.getProvinciasReniec(element.codUbigeo).subscribe((data) => {
          data.data.forEach((prov: any) => {
            this.datosService.getDistritosReniec(prov.codUbigeo).subscribe((dataDist) => {
              dataDist.data.forEach((distr: any) => {
                let direcciones = distr.codUbigeo.match(/.{1,2}/g);
                this.listUbicaciones.push({ nombreUbicacion: distr.descUbigeo + ' - ' + prov.descUbigeo + ' - ' + element.descUbigeo, codUbigeo: distr.codUbigeo, codUbiDep: direcciones[0], codUbiProv: direcciones[1], codUbiDistr: direcciones[2] })
              })
            })
          })
        })
      });
    })
  }
} 
