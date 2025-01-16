import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ConnectionService } from '@services/connection.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternetGuard implements CanActivate {
  constructor(
    private connectionService: ConnectionService){
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!navigator.onLine) {
        this.connectionService.updateConnectionStatus(false);
      }
      return true; // Permitir la navegación independientemente de la conexión
  }
  
}
