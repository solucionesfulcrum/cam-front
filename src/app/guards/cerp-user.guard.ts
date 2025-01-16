import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { TokenService } from '@services/token.service';
import { Observable } from 'rxjs';
const helperJWT = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class CerpUserGuard implements CanActivate {

  constructor(private router: Router, private tokenService: TokenService, private datosGeneralesService: DatosGeneralesService){}

  canActivate(){
    const decodedToken = helperJWT.decodeToken(this.tokenService.getToken()!);
    if (localStorage.getItem('UnidElegida') == null || localStorage.getItem('UnidElegida') == 'undefined') {
      this.router.navigate(['/app/admin'])
      return false;
    }
    else{
      return true;
    }

    // if (JSON.parse(localStorage.getItem('camUser')!)) {
    //   const userCategoria = (JSON.parse(localStorage.getItem('camUser')!)).categoria;
    //   if (userCategoria !== 'SIGPS') {
    //     this.router.navigate(['/app/admin'])
    //     return false
    //   }
    //   return true
    // }
    // else{
    //   if (decodedToken.roles.includes('ADMIN')) {
    //     this.router.navigate(['/app/admin'])
    //     return false;        
    //   }
    //   else{
    //     return false
    //   }
    // }
  }
  
}
