import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DatosGeneralesService } from '../data/services/datos-generales.service';

@Injectable({
  providedIn: 'root',
})
export class MantenimientoGuard implements CanActivate {
  constructor(
    private router: Router,
    private datosGeneralesService: DatosGeneralesService
  ) {}

  // Verifica si el mantenimiento puede ser bypassed usando `secretKeyPass`
  private isMaintenanceBypassed(): { existe: boolean, iguales: boolean } {
    const params = new URLSearchParams(window.location.search); // Obtener parámetros de la URL
    const secretKeyPass = params.get('secretKeyPass'); // Obtener el parámetro 'secretKeyPass'
    const expectedSecretKey = 'kusG2dkMa2oacXnZAm4vqpt6OSRblTGj'; // Valor esperado para el parámetro
    return {
      existe: secretKeyPass != null,                // True si el parámetro existe
      iguales: secretKeyPass === expectedSecretKey  // True si el parámetro coincide con el valor esperado
    };
  }

  canActivate(): Observable<boolean> {
    const bypassStatus = this.isMaintenanceBypassed();

    if (bypassStatus.existe && bypassStatus.iguales) {
      // Si existe y es válido, permitir acceso
      return of(true);
    }

    // Verificar el estado de mantenimiento desde el servicio
    return this.datosGeneralesService.consultaActivacionApp('HTEGSTYR5755').pipe(
      map((response: any) => {
        if (!response?.data?.activa) {
          // Redirigir a la página de mantenimiento si el sistema está activo en mantenimiento
          this.router.navigate(['/mantenimiento']);
          return false;
        }
        return true; // Permitir acceso si no está en mantenimiento
      }),
      catchError(() => {
        // En caso de error, redirigir a mantenimiento como medida de seguridad
        this.router.navigate(['/mantenimiento']);
        return of(false);
      })
    );
  }
}
