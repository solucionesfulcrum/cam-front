import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CompletoRegistro } from 'src/app/core/_model/auth/registro';
import { RegistroUsuario } from 'src/app/core/_model/dataModal/modal';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-registro-codigo',
  templateUrl: './registro-codigo.component.html',
  styleUrls: ['./registro-codigo.component.css'],
})
export class RegistroCodigoComponent implements OnInit {
  form = this.fb.group({
    codigoCtrl: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
    ],
  });
  loading!: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RegistroUsuario,
    private fb: FormBuilder,
    private router: Router,
    private dialogRef: MatDialogRef<RegistroCodigoComponent>,
    private authSvc: AuthService,
    private toastrSvc: ToastrService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  registrarUsuario(): void {
    const formValue = this.form.value;
    const DATA: CompletoRegistro = {
      codigo: formValue.codigoCtrl as string,
      guiid: this.data.data.guiid
    }
    this.authSvc.completarRegistro(DATA).subscribe({
      next: (resp) => {
        console.log("RESP COMPLETAR",resp)
        if (typeof(resp) === 'boolean' && resp === true) {
          this.toastrSvc.success("Registro realizado", "Para ingresar comunique a su administrador de usuarios");
          this.dialogRef.close();
          this.router.navigate(['/']);
        }
        if (typeof(resp) === 'object') {
          this.toastrSvc.warning(resp.message);
          this.dialogRef.close();
        }

      },
      error: (error) => {
        console.log(error);
        this.toastrSvc.error("Ha ocurrido un error");
        this.dialogRef.close();
      }
    })

  }
}
