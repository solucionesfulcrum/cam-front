import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { Parametro } from '@models/parametros-busqueda.model';
import { data } from 'autoprefixer';
import { ubicacionGeo } from '@models/admision/ficha-admision.model';
import { Observable, map, startWith } from 'rxjs';
import { RequestDatosPersonalesRegistro } from '@models/dashboard/dashboard.model';
import { NotificationService } from '@services/notification.service';


@Component({
  selector: 'esp-edit-active-user',
  templateUrl: './edit-active-user.component.html',
  styleUrls: ['./edit-active-user.component.scss']
})

export class EditActiveUserComponent {
  opcionesGenero: Parametro[] = [];
  opcionesEstadoCivil: Parametro[] = [];
  opcionesNacionalidad: Parametro[] = [];
  nombreCompleto = '';
  ubicacionSeleccionadaTmp!: ubicacionGeo;
  listUbicaciones: ubicacionGeo[] = [];
  filteredOptions!: Observable<ubicacionGeo[]>;

  public formDatosPersonales = this.fb.nonNullable.group({
    //frmSelectDoc: new FormControl(''),
    //frmNombres: ['', [Validators.required, Validators.minLength(8)]]
    frmNombres: ['', [Validators.required]],
    frmApellidos: ['', [Validators.required]],
    frmCelular: ['', [Validators.required]],
    frmCorreo: ['', [Validators.required]],
    frmDireccion: ['', [Validators.required]],
    frmFechNacimiento: ['', [Validators.required]],
    frmGenero: ['', [Validators.required]],
    frmEstadoCivil: ['', [Validators.required]],
    frmNacionalidad: ['', [Validators.required]],
    frmTipoDoc: ['', [Validators.required]],
  });

  distrControl = new FormControl();

  constructor(private fb: FormBuilder, private datosService: DatosGeneralesService, private notificationService: NotificationService) {

  }

  grabarDatosPersonales() {
    //console.log("guardar", this.distrControl.value.nombreUbicacion)
    //console.log("filteredOptions", this.filteredOptions)
    this.datosService.registerDatosPersonales(this.getPayloadRegistro()).subscribe((data) => {
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
    this.formDatosPersonales.controls.frmCorreo.disable();
    this.formDatosPersonales.controls.frmTipoDoc.disable();
    this.datosService.getTipoParametros('GENERO').subscribe((data) => {
      this.opcionesGenero = data.data;
    });
    this.datosService.getTipoParametros('ESTADO_CIVIL').subscribe((data) => {
      this.opcionesEstadoCivil = data.data;
    });
    this.datosService.getObtenerNacionalidad('E').subscribe((data) => {

      this.opcionesNacionalidad = data.data;
    });

    const idUsuarioTemp = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario

    this.datosService.getObtenerDatos(idUsuarioTemp).subscribe((data) => {
      console.log("datos personales", data.data.datosPersonales)
      this.nombreCompleto = data.data.datosPersonales.nombres + " " + data.data.datosPersonales.apellidos;
      this.formDatosPersonales.controls.frmNombres.setValue(data.data.datosPersonales.nombres)
      this.formDatosPersonales.controls.frmApellidos.setValue(data.data.datosPersonales.apellidos)
      this.formDatosPersonales.controls.frmCelular.setValue(data.data.datosPersonales.celular)
      this.formDatosPersonales.controls.frmCorreo.setValue(data.data.datosPersonales.email)
      this.formDatosPersonales.controls.frmDireccion.setValue(data.data.datosPersonales.direccion)
      this.formDatosPersonales.controls.frmTipoDoc.setValue(data.data.datosPersonales.tipoDocumento)
      this.formDatosPersonales.controls.frmEstadoCivil.setValue(data.data.datosPersonales.paramEstadoCivilId)
      this.formDatosPersonales.controls.frmGenero.setValue(data.data.datosPersonales.paramGeneroId)
    })

    this.getUbicaciones();
    //this.distrControl.valueChanges.subscribe(()=> this.showErrorSelect = false );
    this.filteredOptions = this.distrControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.nombreUbicacion),
      map(nombreUbicacion => nombreUbicacion ? this._filter(nombreUbicacion) : this.listUbicaciones.slice())
    );
    this.distrControl.addValidators([Validators.required])
  }

  getPayloadRegistro(): RequestDatosPersonalesRegistro {
    return {
      idUsuario: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario,
      nombres: this.formDatosPersonales.value.frmNombres!,
      apellidos: this.formDatosPersonales.value.frmApellidos!,
      celular: this.formDatosPersonales.value.frmCelular!,
      codUbiDep: '15',
      codUbiProv: '01',
      codUbiDist: '07',
      direccion: 'Calle Ejemplo 123, Barrio Seguro',
      fechaNacimiento: '1985-08-25',
      paramEstadoCivilId: parseInt(this.formDatosPersonales.value.frmEstadoCivil!),
      paramGeneroId: parseInt(this.formDatosPersonales.value.frmGenero!),
      idNacionalidad: 568,
      idProfesion: 1,
      rne: 'rne123',
      cmp: 'cmp123'
    }
  }

  private _filter(value: string): ubicacionGeo[] {

    if (value != undefined) {
      const filterValue = value.toLowerCase();
      return this.listUbicaciones.filter(option => option.nombreUbicacion.toLowerCase().includes(filterValue));
    }
    return this.listUbicaciones
  }

  displayFnUbicacion(selectedoption: any) {
    return selectedoption ? selectedoption.nombreUbicacion : undefined;
  }

  onSelectionChangeJefe(event: any) {
    this.ubicacionSeleccionadaTmp = event.option.value;
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
