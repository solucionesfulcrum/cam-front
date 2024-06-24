import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactoProfesionalesService } from '@services/contacto/contacto-profesionales.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { NotificationService } from '@services/notification.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';

@Component({
  selector: 'esp-contacto-sub-detalle-profesional',
  templateUrl: './contacto-sub-detalle-profesional.component.html',
  styleUrls: ['./contacto-sub-detalle-profesional.component.scss']
})
export class ContactoSubDetalleProfesionalComponent {
  idProfesional = '';
  edicionActiva: boolean = false;
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Cancelar'},
    {texto: 'Editar', esImagen: true, rutaIcono: 'assets/svg/iconFileEdit.svg'},
    {texto: 'Activar', colorBtn:'mezclado'},
  ]
  opcionesEdicionBotones: FormatoBoton[] = [
    {texto: 'Cancelar'},
    {texto: 'Actualizar', colorBtn:'mezclado'},
  ]

  rutasCitas=[
    {url:`/app/contact/${this.idProfesional}`, title:'Parámetros'},
    {url:`/app/contact/${this.idProfesional}/horarios`, title:'Horarios'}
  ]

  edicionRutasProfesionales=[
    {url:`/app/contact/${this.idProfesional}/edit`, title:'Parámetros'},
    {url:`/app/contact/${this.idProfesional}/edit/horarios`, title:'Horarios'}
  ]

  infoProfesional: any = Object();

  ubiDepa = null;
  ubiProv = null;
  ubiDist = null;

  constructor(private activeRoute                   : ActivatedRoute,
              private contactoProfesionalService    : ContactoProfesionalesService,
              private router                        : Router,
              private datosGeneralesService         : DatosGeneralesService,
              private notificationService           : NotificationService) {

              this.idProfesional = this.activeRoute.snapshot.paramMap.get('idProfesional')!;
              if (this.activeRoute.snapshot.url.length > 1) {
                this.edicionActiva = true;
                this.edicionRutasProfesionales[0].url = `/app/contact/${this.idProfesional}/edit`;
                this.edicionRutasProfesionales[1].url = `/app/contact/${this.idProfesional}/edit/horarios`;
              }
              else{
                this.rutasCitas[0].url = `/app/contact/${this.idProfesional}`;
                this.rutasCitas[1].url = `/app/contact/${this.idProfesional}/horarios`;
              }
  }

  ngOnInit(){
    this.getProfesionalData();
  }

  getProfesionalData(){
    
    this.contactoProfesionalService.getInfoPersonal(this.idProfesional).subscribe((data)=>{
      if(data.code == 0){
        this.infoProfesional = data.data;
        //console.log(data.data)
        if (data.data.pefilProfesional.codUbigDistrito && data.data.pefilProfesional.codUbigProvincia && data.data.pefilProfesional.codUbigRegion) {
          this.datosGeneralesService.searchByUbigeo(data.data.pefilProfesional.codUbigDistrito + data.data.pefilProfesional.codUbigProvincia + data.data.pefilProfesional.codUbigRegion).subscribe((ubicacion)=>{
            if (ubicacion.code == 0) {
              this.ubiDepa = ubicacion.data.region;
              this.ubiProv = ubicacion.data.provincia;
              this.ubiDist = ubicacion.data.distrito;
            }
            else{
              this.notificationService.warning(ubicacion.message);
            }
          })
        }
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }
  
  funcionesExtra(opt: number){
    switch (opt) {
      case 0: // Cancelar
        this.router.navigate(['/app/contact']);
        break;
      case 1: //Editar
      this.router.navigate(['/app/contact/'+this.idProfesional+'/edit']);
        break;
      case 2: // Activar

        break;
      case 3: // Cancelar Edición
        this.router.navigate(['/app/contact/'+this.idProfesional]);
        break;
      case 4: //Actualización
        if (this.contactoProfesionalService.asignacionProcesosCompartida.usuarioId && this.contactoProfesionalService.asignacionProcesosCompartida.procesos && this.contactoProfesionalService.asignacionProcesosCompartida.horasMensuales) {
          this.contactoProfesionalService.setChangesToPro().subscribe((data)=>{
            if(data.code == 0){
              this.notificationService.success('Se registró su asignación');
              this.router.navigate(['/app/contact/'+this.idProfesional]);
            }
            else{
              this.notificationService.warning(data.message);
            }
          })
        }
        else{
          this.notificationService.warning('Completar los campos antes de enviarse los datos');
        }
        break;
    }
  }
}
