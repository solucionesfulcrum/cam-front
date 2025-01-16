import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactoProfesionalesService } from '@services/contacto/contacto-profesionales.service';
import { NotificationService } from '@services/notification.service';
import { UsersService } from '@services/users.service';

@Component({
  selector: 'esp-tab-contacto-detalle-parametros',
  templateUrl: './tab-contacto-detalle-parametros.component.html',
  styleUrls: ['./tab-contacto-detalle-parametros.component.scss']
})
export class TabContactoDetalleParametrosComponent {

  idProfesional = '';
  edicionActiva: boolean = false;
  ctrlActivo = new FormControl();

  dataActivacion: any = null;

  optSelected: any[] = [];

  opcionesProcesos: any[] = [];

  ctrlHoras = new FormControl(0,[Validators.pattern("^[0-9]*$")]);
  ctrlProcesos = new FormControl();

  constructor(private contactoProfesionalService    : ContactoProfesionalesService,
              private userService                   : UsersService,
              private notificationService           : NotificationService,
              private router                        : Router,
              private activeRoute                   : ActivatedRoute,){
              this.idProfesional = this.activeRoute.parent?.snapshot.paramMap.get('idProfesional')!;
              if (this.activeRoute.parent!.snapshot.url.length > 1) {
                this.edicionActiva = true;
              }
  }
  ngOnInit(){
    this.getDatosProfesional();
    this.ctrlProcesos.valueChanges.subscribe((data)=>{
      this.contactoProfesionalService.asignacionProcesosCompartida.procesos = data;
    })
    this.ctrlHoras.valueChanges.subscribe((data)=>{
      if (typeof data == 'number') {
        this.contactoProfesionalService.asignacionProcesosCompartida.horasMensuales = data;
      }
    })
  }

  getDatosProfesional(){
    this.contactoProfesionalService.getListProcesos().subscribe((data)=>{
      if(data.code == 0){
        this.opcionesProcesos = data.data;
        this.contactoProfesionalService.getInfoPersonal(this.idProfesional).subscribe((data)=>{
          if(data.code == 0){
            this.contactoProfesionalService.asignacionProcesosCompartida.usuarioId = parseInt(this.idProfesional);
            if (data.data.parametrosProfesional.procesos) {
              let procesosAsignados = data.data.parametrosProfesional.procesos;
              for (let i = 0; i < procesosAsignados.length; i++) {
                let processId = this.opcionesProcesos.find((x)=>{return x.nombre === procesosAsignados[i].proceso}).procesoId;
                this.optSelected.push(processId);
                (document.getElementById('proceso_'+processId) as HTMLInputElement).checked = true;
              }
              this.ctrlProcesos.setValue(this.optSelected);
            }
            if(data.data.parametrosProfesional.horasMensuales){
              this.ctrlHoras.setValue(data.data.parametrosProfesional.horasMensuales);
            }
          }
          else{
            this.notificationService.warning(data.message);
          }
        })
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
    this.userService.getActivacionActiva(parseInt(this.idProfesional)).subscribe((data)=>{
      if(data.code == 0){
        this.dataActivacion = data.data;
        if (this.dataActivacion.estado === 'Activo') {
          this.ctrlActivo.setValue(true)
        }
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  SelectProceso(event: Event) {
    const { target } = event;
    if ((target as HTMLInputElement).checked && !this.optSelected.includes((target as HTMLButtonElement).value)) {
      this.optSelected.push(parseInt((target as HTMLButtonElement).value))
    }
    else if (!(target as HTMLInputElement).checked){
      let index = this.optSelected.findIndex(obj => obj == (target as HTMLButtonElement).value);
      this.optSelected.splice(index,1);
    }
    this.ctrlProcesos.setValue(this.optSelected);
    // if (target) //console.log((target as HTMLButtonElement).id, (target as HTMLButtonElement).value, (target as HTMLInputElement).checked);
  }

  sendChanges(){
    if (this.optSelected.length == 0 || !this.ctrlHoras.valid) {
      this.notificationService.warning('Completar los campos antes de enviarse los datos');
    }
    else{
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
  }

  opcionesEdicion(opt: number){
    switch (opt) {
      case 1:
        this.router.navigate(['/app/contact/'+this.idProfesional]);
        break;
      case 2:
        this.sendChanges();
        break;
    }
  }
}
