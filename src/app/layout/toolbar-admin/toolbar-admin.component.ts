import { CdkMenuModule } from '@angular/cdk/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '@services/auth.service';
import { TokenService } from '@services/token.service';
import { SharedModule } from '@shared/shared.module';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
const helperJWT = new JwtHelperService();

@Component({
  selector: 'esp-toolbar-admin',
  templateUrl: './toolbar-admin.component.html',
  styleUrls: ['./toolbar-admin.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule, OverlayModule, CdkMenuModule, MatSidenavModule],
})
export class ToolbarAdminComponent {

  userInfo = Object();
  userRol: string = '';
  imagenFoto: any = null;

  constructor(private tokenService: TokenService,
              private authService:AuthService,
              private router:Router,
              private datosService: DatosGeneralesService) { }

  ngOnInit(){
   // alert(this.userRol);
    if(localStorage.getItem('camUser') != 'null'){
      //this.setImagenPerfil();
      this.userInfo = JSON.parse(localStorage.getItem('camUser')!);
      // let idUnid: string;
      if ((JSON.parse(localStorage.getItem('camUser')!)).nombreRol) {
        this.userRol = (JSON.parse(localStorage.getItem('camUser')!)).nombreRol;
      }
      else{
        this.userRol = 'Sin Rol Asignado';
      }
      this.setImagenPerfil();
      // idUnid = (JSON.parse(localStorage.getItem('camUser')!)).idUnidOperativa;
      // this.datosService.getUnidadesOperativas('').subscribe((data) =>{
      //   this.unidOpeUserSession = data.data.find((x: any)=> {return x.idUnidOperativa == idUnid!}).descripcionCompleta;
      //   this.showUnidOpe = true;
      // });
    }
    else{
      this.userRol = 'Sin Rol Asignado';
    }
  }
  
  setImagenPerfil(){
    const idUsuarioTemp = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario
    this.datosService.getObtenerDatos(idUsuarioTemp).subscribe((data) => {
      this.imagenFoto = data.data.datosPersonales.fotoPerfilImg
    })
  }
  
  logout(){
    this.authService.logout()
    this.router.navigate(['/login'])
  }
  
  config(){
    this.router.navigate(['/app/admin/edit-user'])
  }
}
