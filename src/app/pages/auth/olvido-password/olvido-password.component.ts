import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CambioPasswordComponent } from '../modals/cambio-password/cambio-password.component';
import { AuthService } from '../services/auth-service.service';

@Component({
  selector: 'app-olvido-password',
  templateUrl: './olvido-password.component.html',
  styleUrls: ['./olvido-password.component.css'],
})
export class OlvidoPasswordComponent implements OnInit {
  form = this.fb.group({
    username: ['', [Validators.required]],
  });
  loading!: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authSvc: AuthService
  ) {}

  ngOnInit(): void {}

  cambiarPassword(): void {
    const formValue = this.form.value;
    const DATA = {
      usuario: formValue.username
    }
    this.authSvc.preCambiarPassword(DATA).subscribe({
      next: (resp) => {
        console.log("RESP CAMBIAR",resp);
        this.abrirModalCambioPassword(resp, DATA.usuario as string);
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {

      }
    });
  }

  abrirModalCambioPassword(resp: string, usuario: string): void {
    const dialog = this.dialog.open(CambioPasswordComponent, {
      data: {title: 'Nueva contraseña', resp, usuario},
      width: '450px',
      disableClose: true
    });
    dialog.afterClosed().subscribe((rpta) => {
      console.log(rpta);
    });
  }

  volverLogin(): void {
    this.router.navigate(['/']);
  }
}
