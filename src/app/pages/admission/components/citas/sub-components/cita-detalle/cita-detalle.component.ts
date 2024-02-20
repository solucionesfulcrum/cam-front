import { registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { ActivatedRoute } from '@angular/router';
import { AdmisionCitasService } from '@services/admision/admision-citas.service';
import { AdmisionFichaService } from '@services/admision/admision-ficha.service';
import { NotificationService } from '@services/notification.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'esp-cita-detalle',
  templateUrl: './cita-detalle.component.html',
  styleUrls: ['./cita-detalle.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class CitaDetalleComponent {
  idHistoria = '';
  datosFicha = Object();
  waiting = true;
  faSpinner = faSpinner;
  rutasCitas=[
    {url:`/app/admission/citas/${this.idHistoria}`, title:'Actividades'},
    {url:`/app/admission/citas/${this.idHistoria}/historial`, title:'Historial'}
  ]

  opcionesBotones: FormatoBoton[] = [
    {texto: 'Generar Evaluación Inicial', colorBtn:'success', deshabilitado: true},
    {texto: 'Programar Adicionales', esImagen: true, rutaIcono: 'assets/svg/iconFileEdit.svg'},
    {texto: 'Enviar Citas'},
  ]

  activeTab!: string;

  edadPersona: number = 0;
  diasDesdeRegistro: number = 0;

  // infoFicha: any = Object();

  constructor(private activeRoute                   : ActivatedRoute,
              private notificationService           : NotificationService,
              private _admisionFichaService         : AdmisionFichaService,
              private _admisionCitasService         : AdmisionCitasService) {
      this.idHistoria = this.activeRoute.snapshot.paramMap.get('idHist')!;
      this.rutasCitas[0].url = `/app/admission/citas/${this.idHistoria}`;
      this.rutasCitas[1].url = `/app/admission/citas/${this.idHistoria}/historial`;
    }

  ngOnInit(): void{
    this._admisionFichaService.getFicha(this.idHistoria).subscribe((data)=>{
      console.log(data)
      if (data.code == 0) {
        this.datosFicha = data.data;
        var timeDiff = Math.abs(Date.now() - (new Date(this.datosFicha.asegurado.fecNacimiento)).getTime());
        this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        var timeDiff = Math.abs(Date.now() - (new Date(this.datosFicha.fichaAdmision.fechaRegistro)).getTime());
        this.diasDesdeRegistro = Math.floor(timeDiff / (1000 * 3600 * 24));
        this.waiting = false;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }
}
