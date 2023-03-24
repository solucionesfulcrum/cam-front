import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/pages/auth/services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService:AuthService,
    private router:Router
  ){

  }

  canActivate(): boolean{

    if(this.authService.isLogin())
      return true

    //this.router.navigateByUrl(`${environment.api}/auth`)
    this.router.navigate(['/'])
    return false
  }

  
}
