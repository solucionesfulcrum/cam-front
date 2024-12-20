import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { RequestStatus } from '@models/request-status.model';
import { UsersService } from '@services/users.service';
import { NotificationService } from '@services/notification.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from '@services/token.service';
import { environment } from '@environments/environment';
import { BroadcastService } from 'src/app/data/services/gestion-app/broadcast-service.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
const helperJWT = new JwtHelperService();

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  @ViewChild('nameInput') nameInput!: ElementRef;
  form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  showPassword = false;
  status: RequestStatus = 'init';
  msgSSO: string = '';
  appStatusLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UsersService,
    private authService: AuthService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private _notification: NotificationService,
    private broadcastService: BroadcastService,
    private datosGeneralesService: DatosGeneralesService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      const username = params.get('username');
      if (username) this.form.controls.username.setValue(username);
    });
  }
  ngAfterViewInit(){
    this.nameInput.nativeElement.focus();
  }

  private isMaintenanceBypassed(): { existe: boolean; iguales: boolean; secretKeyPass: string } {
    const params = new URLSearchParams(window.location.search);
    const secretKeyPass = params.get('secretKeyPass');
    const expectedSecretKey = 'kusG2dkMa2oacXnZAm4vqpt6OSRblTGj';
    return {
      existe: secretKeyPass != null,
      iguales: secretKeyPass === expectedSecretKey,
      secretKeyPass: secretKeyPass || '',
    };
  }

  doLogin(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.appStatusLoading = true;
    const bypassStatus = this.isMaintenanceBypassed();

    if (bypassStatus.existe && bypassStatus.iguales) {
      // Permitir login si bypass es válido
      this.executeLogin();
      return;
    }

    this.datosGeneralesService.consultaActivacionApp('HTEGSTYR5755').subscribe({
      next: (response: any) => {
        this.appStatusLoading = false;
        if (response?.data?.activa) {
          // Si el sistema está activo, proceder con el login
          this.executeLogin();
        } else {
          this._notification.info(response.data.mensaje);
        }
      },
      error: () => {
        this.appStatusLoading = false;
        this.msgSSO = 'Error al verificar el estado de la aplicación.';
      },
    });
  }

  private executeLogin(): void {
    this.status = 'loading';
    const { username, password } = this.form.getRawValue();
    this.authService.login(username, password).subscribe({
      next: async (rta) => {
        this.userService.getUserSessionActive(rta.data.id).subscribe((data) => {
          localStorage.clear();
          localStorage.setItem('environment', environment.environment);
          if (data.data) {
            localStorage.setItem('camUser', JSON.stringify(data.data));
            this.status = 'success';
            this.router.navigate(['/app/admin']);
          } else {
            const decodeToken = helperJWT.decodeToken(this.tokenService.getToken()!);
            if (decodeToken.roles.includes('ADMIN')) {
              localStorage.setItem('camUser', JSON.stringify(data.data));
              this.status = 'success';
              this.router.navigate(['/app/admin']);
            }
          }
          this.broadcastService.emitSessionUpdate(); // Emitir el evento global
        });
      },
      error: (rta) => {
        this.status = 'failed';
        this.authService.getSSOMessage.subscribe((msg) => {
          this.msgSSO = msg;
        });
        if (rta?.statusText === 'Bad credentials') this.msgSSO = 'Credenciales incorrectas';
      },
    });
  }
}
