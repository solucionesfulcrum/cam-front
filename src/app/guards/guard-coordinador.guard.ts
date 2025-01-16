import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from '@services/token.service';
import { Observable } from 'rxjs';
const helperJWT = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class GuardCoordinadorGuard implements CanActivate {

  constructor(private router: Router, private tokenService: TokenService){}

  canActivate(){
    const isValidToken = this.tokenService.isValidRefreshToken()
    if (!isValidToken){
      this.router.navigate(['/login'])
      return false
    }
    else{
      let unid = JSON.parse(localStorage.getItem('UnidElegida')!);
      if (unid.idRol != 8) {
        this.router.navigate(['/app/dashboard'])
        return false;
      }
      else{
        return true;
      }
    }
  }
  
}
