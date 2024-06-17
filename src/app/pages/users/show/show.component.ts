import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@models/user.model';
import { UsersService } from '@services/users.service';
import { SharedModule } from '@shared/shared.module';
import { ActiveUserModalComponent } from '../active-user-modal/active-user-modal.component';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent {
  user:any = Object();
  idUser: any;

  rolAsignado: string = '';
  today = new Date();
  showNuevo: boolean = false;
  activaciones: any = [];

  distrito: string = ''
  provincia: string = ''
  region: string = ''

  constructor(private route: ActivatedRoute,
    private _usersService:UsersService,
    private datosGenerales : DatosGeneralesService,
    private dialog : Dialog) {
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
      this._usersService.getUser(this.idUser).subscribe((data)=>{
        this.user = data.data;
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

  setUbigeo(codUbigeo: string){
    this.datosGenerales.searchByUbigeo(codUbigeo).subscribe((rpta)=>{
      this.region = rpta.data.region;
      this.provincia = rpta.data.provincia;
      this.distrito = rpta.data.distrito;
    });
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
