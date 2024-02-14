import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CompletoRegistro } from 'src/app/core/_model/auth/registro';
import {
  DataUsuario,
  RegistroUsuario,
} from 'src/app/core/_model/dataModal/modal';
import { AuthService } from '../../services/auth-service.service';
import { RegistroUsuarioForSistema } from 'src/app/core/_model/auth/registroForSistema';

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
    console.log("la data extraida",this.data.data);
  }

  registrarUsuario(): void {
    const formValue = this.form.value;

    const DATA: CompletoRegistro = {
      guiid: this.data.data.guiid,
      numDoc: this.data.data.numDoc!,
      codigo: formValue.codigoCtrl as string,
    };

    const dataSend: any = {
      categoria: "CAM",
      correo: this.data.data.email,
      tipoDoc: this.data.data.tipoDoc!,
      numDoc: this.data.data.numDoc!,
      nombres: this.data.data.nombres,
      codPlanilla: this.data.data.codPlanilla,
      unidadOperativaId: this.data.data.unidadOperativa,
      guiidSso: this.data.data.guiid
    };
    console.log("datasend",dataSend)
    this.authSvc.completarRegistro(DATA).subscribe({
      next: (resp) => {
        console.log("exito validar correo",resp)
        if (typeof resp.data === 'boolean' && resp.data === true) {
          this.authSvc.createUserForSistema(dataSend).subscribe({
            next: (resp) => {
              console.log("registrar usuario", resp)
              this.toastrSvc.warning(
                'Registro de usuario para el sistema realizado correctamente',
              );
            },
          });

          this.authSvc.confirmarEmail(dataSend.guiidSso).subscribe({
            next: (resp:any) => {
              console.log("correo confirmado .... ", resp);
            },
            error: (resp) => {
              console.log("error de confirmacion de correo .... ", resp);
            },
          });

          this.toastrSvc.success(
            'Registro realizado - SSO',
            'Para ingresar comunique a su administrador de usuarios'
          );
          this.dialogRef.close();
          this.router.navigate(['/']);
        }
        if (typeof resp === 'object') {
          //this.toastrSvc.warning(resp.message);
          this.dialogRef.close();
        }

      },
      error: (error) => {
        console.log(error);
        this.toastrSvc.error('Ha ocurrido un error');
        this.dialogRef.close();
      },
    });
  }
}
