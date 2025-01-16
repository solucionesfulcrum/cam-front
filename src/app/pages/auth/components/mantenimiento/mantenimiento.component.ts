import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'esp-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.scss']
})
export class MantenimientoComponent implements OnInit {

  mensajeMantenimiento: string = "";
  loading: boolean = true;

  constructor(
    private datosGeneralesService: DatosGeneralesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar bypass mediante secretKeyPass
    const bypassStatus = this.isMaintenanceBypassed();

    if (bypassStatus.existe && bypassStatus.iguales) {
      // Si el bypass es válido, redirigir al login con el secretKeyPass en la URL
      this.router.navigate(['/login'], {
        queryParams: { secretKeyPass: bypassStatus.secretKeyPass }
      });
      return;
    }

    // Verificar el estado del mantenimiento si no se permite el bypass
    this.verificarEstadoMantenimiento();
  }

  verificarEstadoMantenimiento(): void {
    this.datosGeneralesService.consultaActivacionApp('HTEGSTYR5755').subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response?.data?.activa) {
          // Si el sistema ya no está en mantenimiento, redirigir al login con el secretKeyPass en la URL
          this.router.navigate(['/login']);
        } else {
          this.mensajeMantenimiento = response.data.mensaje;
        }
      },
      error: () => {
        this.loading = false;
        console.error('Error al verificar el estado del mantenimiento.');
      }
    });
  }

  private isMaintenanceBypassed(): { existe: boolean, iguales: boolean, secretKeyPass: string } {
    const params = new URLSearchParams(window.location.search); // Obtener parámetros de la URL
    const secretKeyPass = params.get('secretKeyPass'); // Obtener el parámetro 'secretKeyPass'
    const expectedSecretKey = 'kusG2dkMa2oacXnZAm4vqpt6OSRblTGj'; // Valor esperado para el parámetro
    return {
      existe: secretKeyPass != null,                // True si el parámetro existe
      iguales: secretKeyPass === expectedSecretKey,  // True si el parámetro coincide con el valor esperado
      secretKeyPass: secretKeyPass || ''            // Retornar el valor del secretKeyPass
    };
  }
}
