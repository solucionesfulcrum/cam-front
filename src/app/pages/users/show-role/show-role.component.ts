import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@models/user.model';
import { UsersService } from '@services/users.service';
import { SharedModule } from '@shared/shared.module';
import { ActiveUserModalComponent } from '../active-user-modal/active-user-modal.component';
import { RolService } from '@services/rol.service';
import { RolPemisos } from '@models/rol/rol-data.model';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-show-role',
  templateUrl: './show-role.component.html',
  styleUrls: ['./show-role.component.scss']
})
export class ShowRoleComponent {
  user:any = Object();
  idUser: any;

  rolAsignado: string = '';
  today = new Date();
  showNuevo: boolean = false;
  activaciones: any = [];
  roles! : RolPemisos[];
  statusLoad: boolean = false;

  
  faSpinner = faSpinner;

  dataRol : {registrado: Date, estado: string, descripcion: string}  ={
    registrado: new Date(),
    estado: "ACTIVADO",
    descripcion: "El Coordinador CAM es responsable de la gestión global del Centro de Adulto Mayor. Este rol implica supervisar todos los aspectos del centro, incluyendo personal, finanzas, marketing, mantenimiento y cumplimiento normativo. Además, el Administrador Master es el encargado de establecer la visión estratégica del CAM y asegurarse de que se cumplan los objetivos y la calidad del servicio"
  }

  constructor(private route: ActivatedRoute,
    private rolService:RolService,
    private dialog : Dialog) {
      this.onLoadData();
  }

  onLoadData(){
   this.rolService.getPermisosRoles().subscribe(data => {
    this.roles = data.data;
    this.statusLoad = true;
   })

  }

  openDialog(){
    const dialogRef = this.dialog.open(ActiveUserModalComponent,{
      minWidth:'800px',
      maxWidth:'50%',
      data:{
        idUser: this.idUser,
        user: this.user
      }
    })
    dialogRef.closed.subscribe(out =>{
      this.onLoadData();
    })
  }
}
