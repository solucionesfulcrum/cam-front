import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from '@services/token.service';
import { Observable } from 'rxjs';
const helperJWT = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AdminUserGuard implements CanActivate {

  constructor(private router: Router, private tokenService: TokenService,){}

  canActivate(){
    const decodedToken = helperJWT.decodeToken(this.tokenService.getToken()!);

    if (JSON.parse(localStorage.getItem('sigpsUser')!)) {
      const userCategoria = (JSON.parse(localStorage.getItem('sigpsUser')!)).categoria;
      if (userCategoria !== 'SSO') {
        this.router.navigate(['/app/board'])
        return false
      }
      return true
    }
    else{
      if (decodedToken.roles.includes('ADMIN')) {
        return true;        
      }
      else{
        return false
      }
    }
  }
  
}
