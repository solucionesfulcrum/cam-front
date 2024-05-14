import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { TokenService } from '@services/token.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControlAsistenciaGuard implements CanActivate {

  constructor(private router: Router, private tokenService: TokenService, private notificationService: NotificationService){}

  canActivate(){
    const isValidToken = this.tokenService.isValidRefreshToken()
    if (!isValidToken){
      this.router.navigate(['/login'])
      return false
    }
    else{
      let unid = JSON.parse(localStorage.getItem('UnidElegida')!);
      if (unid.rol !== 'TALLERISTA') {
        this.router.navigate(['/app/dashboard'])
        return false;
      }
      else{
        if (JSON.parse(localStorage.getItem('idProgramElegida')!) == null) {
          this.router.navigate(['/app/control/mis-talleres'])
          this.notificationService.warning('Seleccione un taller para realizar el control de asistencia');
          return false;
        }
        else{
          return true;
        }
      }
    }
  }
}
