import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../pages/auth/services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor(
    private authService:AuthService,
    private router:Router
  ){

  }

  canActivate(): boolean{

    if(!this.authService.isValidToken()){
      return true
    }
    else{
      this.router.navigate(['/app/home'])
      return false
    }
  }

  
}
