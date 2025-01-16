import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaRapidaGuard implements CanActivate {
  constructor(private datosGeneralesService: DatosGeneralesService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.datosGeneralesService.consultaActivacionApp('SASFLTYO2314').pipe(
      map((response: any) => {
        if (response?.data?.activa) {
          return true; // Permitir acceso si está activo
        }
        console.error(response?.data?.mensaje || 'Asistencia Rápida no está activa.');
        this.router.navigate(['/app/control/mis-talleres']); // Redirigir en caso de inactividad
        return false;
      }),
      catchError(() => {
        console.error('Error al verificar el estado de Asistencia Rápida.');
        this.router.navigate(['/app/control/mis-talleres']); // Redirigir en caso de error
        return of(false);
      })
    );
  }
}
