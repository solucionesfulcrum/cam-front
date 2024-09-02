import { Injectable } from '@angular/core';
import {  CanActivate, Router} from '@angular/router';
import { environment } from '@environments/environment';
import { TokenService } from '@services/token.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private tokenService:TokenService, private router: Router){

  }

  canActivate(){
    //const token = this.tokenService.getToken()
    //const isValidToken = this.tokenService.isValidToken()
    const isValidToken = this.tokenService.isValidRefreshToken()

    if(!environment.mantenimiento){

      if (!isValidToken)
        {
          this.router.navigate(['/login'])
          return false
        }
    }
  
    return true;
  }
  
}
