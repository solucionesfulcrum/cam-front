import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { RequestCiramRegistro } from '@models/dashboard/dashboard.model';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { NotificationService } from '@services/notification.service';
import { formatDate } from '@angular/common';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'esp-edit-ciram',
  templateUrl: './edit-ciram.component.html',
  styleUrls: ['./edit-ciram.component.scss']
})
export class EditCiramComponent {
  nombreCam = "";
  datosPerfilCiram: any;
  idUnidadOperativa: any;
  opcionesBotones: FormatoBoton[] = [
    { texto: 'Cancelar' },
    { texto: 'Editar', colorBtn: 'mezclado' },
  ];
  public formRegistroCiram = this.fb.nonNullable.group({
    frmCodigoCentro: ['', [Validators.required]],
    frmNombreCentro: ['', [Validators.required]],
    frmDireccion: ['', [Validators.required]],
    frmDistrito: ['', [Validators.required]],
    frmNumContacto: ['', [Validators.required]],
    frmCorreo: ['', [Validators.required]],
    frmActivo: ['', [Validators.required]],
    frmNombreCam: ['', [Validators.required]],
    frmFechCreacion: ['', [Validators.required]],
    frmNombreLider: ['', [Validators.required]],
  });
  constructor(private fb: FormBuilder,
    private router: Router,
    private datosGeneralesService: DatosGeneralesService,
    private notificationService: NotificationService,
    @Inject(LOCALE_ID) private locale: string,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
  ) {
    this.idUnidadOperativa = this.activeRoute.snapshot.paramMap.get('idUnidadOperativa');
  }

  ngOnInit() {
    console.log("idunid", this.idUnidadOperativa)
    this.nombreCam = (JSON.parse(localStorage.getItem('UnidElegida')!)).unidOperativa
    this.formRegistroCiram.controls.frmNombreCam.setValue((JSON.parse(localStorage.getItem('UnidElegida')!)).unidOperativa)
    this.formRegistroCiram.controls.frmNombreCam.disable();
    this.formRegistroCiram.controls.frmActivo.disable();
    this.authService.getPerfilCiram(this.idUnidadOperativa).subscribe((data) => {
      console.log('hola', data.data)
      this.datosPerfilCiram = data.data
      this.formRegistroCiram.controls.frmCodigoCentro.setValue(data.data.idCentro)
      this.formRegistroCiram.controls.frmFechCreacion.setValue(data.data.fechaIncripcion.split("T")[0])
      this.formRegistroCiram.controls.frmNombreCentro.setValue(data.data.nombre)
      this.formRegistroCiram.controls.frmDireccion.setValue(data.data.direccion)
      this.formRegistroCiram.controls.frmDistrito.setValue(data.data.distrito)
      this.formRegistroCiram.controls.frmNumContacto.setValue(data.data.celular)
      this.formRegistroCiram.controls.frmCorreo.setValue(data.data.correo)
      this.formRegistroCiram.controls.frmNombreLider.setValue(data.data.lider)
      this.formRegistroCiram.controls.frmActivo.setValue(data.data.estado)
    })
    }

  getPayloadRegistro(): RequestCiramRegistro {
    let fechaCreacion = this.formRegistroCiram.value.frmFechCreacion

    return {
      codigoUoCiram: this.formRegistroCiram.value.frmCodigoCentro!,
      idUnidadOperativaCam: (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      activo: 1,
      nombreCiram: this.formRegistroCiram.value.frmNombreCentro!,
      userCreacion: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario,
      correo: this.formRegistroCiram.value.frmCorreo!,
      direccion: this.formRegistroCiram.value.frmDireccion!,
      distrito: this.formRegistroCiram.value.frmDistrito!,
      lider: this.formRegistroCiram.value.frmNombreLider!,
      celular: this.formRegistroCiram.value.frmNumContacto!,
      tipo: "CIRAM",
      fecCreacion: formatDate(fechaCreacion!.split('/')[2] + '/' + fechaCreacion!.split('/')[1] + '/' + fechaCreacion!.split('/')[0], 'yyyy-MM-dd', this.locale),
    }
  }

  actualizarDate(input: any, opt: number) {
    if (input) {
      switch (opt) {
        case 1:
          this.formRegistroCiram.controls.frmFechCreacion.setValue(input)
          break;
        case 2:
          this.formRegistroCiram.controls.frmFechCreacion.setValue(input)
          break;
      }
    }
  }

  optFunc(opt: number) {
    switch (opt) {
      case 1:
        this.router.navigate(['app/adm-uo'])
        break;
      case 2:
        this.datosGeneralesService.registerCiram(this.getPayloadRegistro()).subscribe((data) => {
          if (data.code == 0) {
            this.opcionesBotones[1].loading = false;
            this.notificationService.success('¡Se guardaron los datos de CIRAM!');
            this.router.navigate(['app/adm-uo'])
          }
          else {
            this.opcionesBotones[1].loading = false;
            this.notificationService.warning(data.message);
          }
        })
        break;
      case 3:
        this.datosGeneralesService.registerCiram(this.getPayloadRegistro()).subscribe((data) => {
          if (data.code == 0) {
            this.opcionesBotones[1].loading = false;
            this.notificationService.success('¡Se guardaron los datos del contrato!');
            this.router.navigate(['app/adm-uo'])
          }
          else {
            this.opcionesBotones[1].loading = false;
            this.notificationService.warning(data.message);
          }
        })
        break;
    }
  }
}
