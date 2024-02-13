import { Component, OnInit } from '@angular/core';
import { CdkMenuModule } from '@angular/cdk/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../pages/auth/services/auth-service.service';
///import { TokenService } from '@services/token.service';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-toolbar-admin',
  templateUrl: './toolbar-admin.component.html',
  styleUrls: ['./toolbar-admin.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule, OverlayModule, CdkMenuModule, MatSidenavModule],
})
export class ToolbarAdminComponent implements OnInit {
  userInfo = Object();
  constructor(
    //private tokenService: TokenService,
    private authService:AuthService,
    private router:Router) { }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('dataCam')!);
    console.log("tool",this.userInfo)
  }
  logout(){
    console.log("salir")
    this.authService.logout()
    this.router.navigate(['/']);
  }
}
