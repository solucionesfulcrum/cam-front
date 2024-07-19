import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@models/user.model';
import { UsersService } from '@services/users.service';
import { SharedModule } from '@shared/shared.module';
import { ActiveUserModalComponent } from '../active-user-modal/active-user-modal.component';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ModalAlertComponent } from '@shared/components/modal-alert/modal-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { AsignarRolModalComponent } from '../asignar-rol-modal/asignar-rol-modal.component';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent {
  user:any = Object();
  vigencia:any = Object();
  idUser: any;

  rolAsignado: string = '';
  today = new Date();
  showNuevo: boolean = false;
  activaciones: any = [];
  rolUsuario: string = '';

  distrito: string = ''
  provincia: string = ''
  region: string = ''

  rolesCam : any= {
    "SUPER-ADMIN" : 'ADMIN',
    "CAM" : 'CAM',
    "USER" : 'CAM',
  }

  rolCam: string = '';

  constructor(private route: ActivatedRoute,
    private _usersService:UsersService,
    private datosGenerales : DatosGeneralesService,
    private dialog : Dialog,
    private matDialog: MatDialog
  ) {
      this.onLoadData();
  }

  onLoadData(){
    this.route.params.subscribe(params => {
      this.idUser = params['id']; // (+) converts string 'id' to a number
      localStorage.setItem("userId",String(this.idUser))
        this._usersService.getInformacionActivaciones(this.idUser).subscribe((data)=>{
          /*data.data.forEach((element: any) => {
            if (element.estado === 'ACTIVO') {
              this.rolAsignado = element.nombreRol;
            }
          });*/
        this.activaciones = data.data;
      })
      this._usersService.getUser(JSON.parse(localStorage.getItem('camUser')!)!.idUsuario!).subscribe(userCam=>{
        this._usersService.getRolUsuario(userCam.data.guiid).subscribe(rpta=>{
          this.rolCam = rpta.data[0].codigo;
        })
      })


      this._usersService.getUser(this.idUser).subscribe((data)=>{
        this.user = data.data;

        this._usersService.getRolUsuario(data.data.guiid).subscribe(rpta=>{
          this.rolUsuario = rpta.data[0].codigo;
        })
        this.getVigencia();
        this.setUbigeo(this.user.codRegion + this.user.codProvincia + this.user.codDistrito)
        
        if((Math.trunc((this.today.getTime() - (new Date(this.user.fechaRegistro)).getTime()) / (1000*60*60*24))) <= 7){
          this.showNuevo = true;
        }
        else{
          this.showNuevo = false;
        }
      })
      // this._usersService.getUserInfo(guid).subscribe(
      //   data => this.user = data
      // )
   });

  }

  getVigencia(): void {
    this._usersService.getVigencia(this.user.dni).subscribe(vigencia => {
      if(vigencia.code == 0){
        this.vigencia.tieneVigencia = vigencia.data.tieneVigencia;
        this.vigencia.fecIniVigencia = vigencia.data.fecIniVigencia;
        this.vigencia.fecFinVigencia = vigencia.data.fecFinVigencia;
      }
      else{
        this.vigencia.tieneVigencia = false;
        this.vigencia.fecIniVigencia = "-";
        this.vigencia.fecFinVigencia = "-";
      }
    })
  }

  setUbigeo(codUbigeo: string){
    this.datosGenerales.searchByUbigeo(codUbigeo).subscribe((rpta)=>{
      this.region = rpta.data.region;
      this.provincia = rpta.data.provincia;
      this.distrito = rpta.data.distrito;
    });
  }

  openDialogRol(){
    if(this.user.estado == "CREADO"){
      const dialogRef = this.matDialog.open(ModalAlertComponent,{
        minWidth:'800px',
        maxWidth:'50%',
        data:{
          mensaje : "No se puede asignar un rol porque el usuario no ha terminado con el registro"
        }
      })
    }
    else{
      const dialogRef = this.matDialog.open(AsignarRolModalComponent,{
        minWidth:'800px',
        maxWidth:'50%',
        data:{
          user: this.user,
          idUser: this.idUser
        }
      })
      dialogRef.afterClosed().subscribe((r)=>{
        console.log(r);
        this.onLoadData();
      })
    }
   
  }

  openDialog(){
    if(this.user.estado == "CREADO"){
      const dialogRef = this.matDialog.open(ModalAlertComponent,{
        minWidth:'800px',
        maxWidth:'50%',
        data:{
          mensaje : "No se puede realizar la activación porque el usuario no ha terminado con el registro"
        }
      })
    }
    else{
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
}
