import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/btn/button.component';
import { RouterModule, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '@services/auth.service';
import { RequestStatus } from '@models/request-status.model';
import { RecoverPassword } from '@models/auth/recover-pass.model';
import { NotificationService } from '@services/notification.service';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { CustomValidators } from '@utils/validators';


@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html'
})
export class ForgotPasswordFormComponent {

  email: string = '';
  statusConfirm: RequestStatus = 'init';
  validPass  = 0;
  showPassword = false;
  showConfirmPassword = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  formCambio = this.formBuilder.group({
    codigo: ['', [Validators.required]],
    newPass: ['', [Validators.required]],
    confirmPass: ['', [Validators.required]]
  },
    {
      validators: [
        CustomValidators.MatchValidator('password', 'confirmPassword'),
      ],
    });

  form = this.formBuilder.nonNullable.group({
    numDoc: ['', [Validators.required]],
  });
  status: RequestStatus = 'init';
  emailSent = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _notificacion: NotificationService,
    private authService: AuthService
  ) {

  }

  sendLink() {
    if (this.form.valid) {
      this.status = 'loading';
      this.authService.preRecoverPassword({ usuario: this.form.value.numDoc! }).subscribe((data) => {
        if (data) {
          this.status = 'success';
          this.email = data;
          this.emailSent = true;
        }
        else {
          this._notificacion.warning(`No se encontró ningún usuario con el documento ${this.form.value.numDoc}`)
          this.status = 'failed';
          this.emailSent = false;
        }
        console.log(data);
      })
      // const { numDoc } = this.form.getRawValue();
      // this.authService.recovery(numDoc)
      // .subscribe({
      //   next: ()=>{
      //     this.status='success'
      //     this.emailSent = true
      //   },
      //   error: ()=>{
      //     this.status='failed'
      //   }
      // })
    } else {
      this.form.markAllAsTouched();
    }
  }

  sendChange() {
    this.validPass = 0;
    if (this.formCambio.valid) {
      this.statusConfirm = 'loading';
      if (this.formCambio.value.newPass == this.formCambio.value.confirmPass) {
        this.authService.recoverPassword(this.getRecoverPass()).subscribe((data) => {
          console.log(data)
          if (data == true) {
            this.statusConfirm = 'success';
            this._notificacion.success('Se cambio la contraseña');
            this.router.navigate(['login']);
          }
          else {
            this.statusConfirm = 'failed';
            this._notificacion.warning(data.message);
          }
        })
      } else {
        this.validPass = 1;
        this.statusConfirm = 'init';
      }

    }
    else {
      this.formCambio.markAllAsTouched();
    }
  }

  getRecoverPass(): RecoverPassword {
    return {
      usuario: this.form.value.numDoc!,
      codigo: this.formCambio.value.codigo!,
      password: this.formCambio.value.newPass!
    }
  }

}