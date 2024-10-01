import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RolPemisos } from '@models/rol/rol-data.model';
import { RolService } from '@services/rol.service';
import { ActiveUserModalComponent } from '../active-user-modal/active-user-modal.component';

@Component({
  selector: 'esp-show-role-detalle',
  templateUrl: './show-role-detalle.component.html',
  styleUrls: ['./show-role-detalle.component.scss']
})
export class ShowRoleDetalleComponent {
  user:any = Object();
  idUser: any;

  rolAsignado: string = '';
  today = new Date();
  showNuevo: boolean = false;
  activaciones: any = [];
  roles! : RolPemisos[];
  statusLoad: boolean = false;

  idRol!: number;
  
  faSpinner = faSpinner;

  dataRol : any =  Object();

  constructor(private route: ActivatedRoute,
    private rolService:RolService,
    private dialog : Dialog) {
      this.route.params.subscribe(params => {
        this.idRol = params['roleId']; // Aquí recibes el idRol de la URL
        this.onLoadData(); // Llamas a la función de carga de datos
      });

  }

  onLoadData(){
   this.rolService.getDatosRol(this.idRol).subscribe(data => {
    this.dataRol = data.data;
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
