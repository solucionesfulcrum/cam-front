import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@services/notification.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { AfiliacionesEvaluacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-evaluaciones.service';
import { ContactosAfiliadosService } from 'src/app/data/services/contactos/contactos-afiliados.service';

@Component({
  selector: 'esp-evaluacion-layout',
  templateUrl: './evaluacion-layout.component.html',
  styleUrls: ['./evaluacion-layout.component.scss']
})
export class EvaluacionLayoutComponent {
  faSpinner = faSpinner;
  dataFicha: any = Object();
  edadPersona: number = 0;

  ready = false;
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Notas', esImagen: true, rutaIcono: 'assets/svg/iconFileEdit.svg'},
    {texto: 'Cancelar', colorBtn:'bordeado'},
    {texto: 'Guardar Evaluación', colorBtn:'mezclado', loading: false},
  ];

  constructor(public evaluacionService:               AfiliacionesEvaluacionesService,
              public contactosAfiliadosService      : ContactosAfiliadosService,
              public notificationService            : NotificationService){}

  ngOnInit(){
    if (JSON.parse(localStorage.getItem('idFichaEvaluada')!) != null){
      this.contactosAfiliadosService.obtenerFichaAsegurado(JSON.parse(localStorage.getItem('idFichaEvaluada')!)).subscribe((data)=>{
        if (data.code == 0) {
          this.dataFicha = data.data;
          var dateObject = new Date(data.data.asegurado.fecNacimiento); 
          var timeDiff = Math.abs(Date.now() - dateObject.getTime());
          this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
          this.ready = true;
        }
        else{
          this.notificationService.warning(data.message);
        }
      })
    }
  }

  checkIfAnswered(fg: FormGroup): boolean{
    return Object.values(fg.value).every(value => {if (value == null) { return false } return true;});
  }
}
