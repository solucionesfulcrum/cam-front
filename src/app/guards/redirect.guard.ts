import { Injectable } from '@angular/core';
import {  CanActivate, Router} from '@angular/router';
import { TokenService } from '@services/token.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor( private tokenService:TokenService, private router: Router){

  }

  canActivate(){
    //const token = this.tokenService.getToken()
    //const isValidToken = this.tokenService.isValidToken()
    const isValidToken = this.tokenService.isValidRefreshToken()
    if (isValidToken)
    {
      //this.router.navigate(['/app'])
      this.router.navigate(['/mantenimiento'])
    }
    return true;
  }
  
}
