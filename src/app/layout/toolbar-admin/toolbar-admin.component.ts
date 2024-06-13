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

  constructor(private tokenService: TokenService,
              private authService:AuthService,
              private router:Router) { }

  ngOnInit(){
    if(localStorage.getItem('camUser') != 'null'){
      this.userInfo = JSON.parse(localStorage.getItem('camUser')!);
      // let idUnid: string;
      if ((JSON.parse(localStorage.getItem('camUser')!)).nombreRol) {
        this.userRol = (JSON.parse(localStorage.getItem('camUser')!)).nombreRol;
      }
      else{
        this.userRol = 'Sin Rol Asignado';
      }
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
  
  logout(){
    this.authService.logout()
    this.router.navigate(['/login'])
  }
  
  config(){
    location.href = '/app/admin/edit-user'
  }
}
