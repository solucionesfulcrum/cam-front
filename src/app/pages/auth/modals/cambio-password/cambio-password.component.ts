import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CambioPass } from 'src/app/core/_model/auth/cambioPassword';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-cambio-password',
  templateUrl: './cambio-password.component.html',
  styleUrls: ['./cambio-password.component.css']
})
export class CambioPasswordComponent implements OnInit {
  form = this.fb.group({
    codigoCtrl: ['', [Validators.required]],
    nuevaPasswCtrl: ['', [Validators.required]],
  });
  loading!: boolean;
  hide = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private dialogRef: MatDialogRef<CambioPasswordComponent>,
    private authSvc: AuthService,
    private toastrSvc: ToastrService
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  cambiarPassword(): void {
    const formValue = this.form.value;

    const DATA: CambioPass = {
      codigo: formValue.codigoCtrl as string,
      password: formValue.nuevaPasswCtrl as string,
      usuario: this.data?.usuario,
    }
    this.authSvc.cambiarPassword(DATA).subscribe({
      next: (resp) => {
        this.toastrSvc.success("Cambio de contraseña realizado");
        this.dialogRef.close();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {

      }
    });
    this.dialogRef.close();
  }

}
