import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegistroUsuario } from 'src/app/core/_model/auth/registro';
import { RegistroCodigoComponent } from '../modals/registro-codigo/registro-codigo.component';
import { AuthService } from '../services/auth-service.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  registroForm = this.fb.group({
    tipoDocumentoCtrl: ['', [Validators.required]],
    nroDocumentoCtrl: ['', [Validators.required]],
    codigoPlanCtrl: [''],
    correoCtrl: ['', [Validators.required]],
    nombresCtrl: ['', [Validators.required]],
    passwordCtrl: ['', [Validators.required]],
    confirmPasswordCtrl: ['', [Validators.required]],
  });
  hide = true;
  hide2 = true;
  loading: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authSvc: AuthService,
    private toastrSvc: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  registrarUsuario(): void {
    this.loading = true;
    const formValue = this.registroForm.value;
    const DATA: RegistroUsuario = {
      tipDocIden: formValue.tipoDocumentoCtrl,
      numDocIden: formValue.nroDocumentoCtrl,
      password: formValue.passwordCtrl,
      email: formValue.correoCtrl,
      nombres: formValue.nombresCtrl,
      codigoPlanilla: formValue.codigoPlanCtrl,
    };
    this.authSvc.registrarUsuario(DATA).subscribe({
      next: (resp) => {
        console.log("RESP", resp);
        if (resp.charAt(0) === '{') {
          const respJson = JSON.parse(resp);
          this.toastrSvc.warning(respJson.message);
        } else {
          this.abrirModalRegistro(resp, DATA.email as string);
        }
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  abrirModalRegistro(guiid: string, email: string): void {
    const data = {
      guiid,
      email
    }
    const dialog = this.dialog.open(RegistroCodigoComponent, {
      data: {title: 'Completar Registro', data},
      width: '450px',
      disableClose: true
    });
    dialog.afterClosed().subscribe();
  }

  volverLogin(): void {
    this.router.navigate(['/']);
  }
}
