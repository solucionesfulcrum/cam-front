import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { RequestStatus } from '@models/request-status.model';
import { UsersService } from '@services/users.service';
import { NotificationService } from '@services/notification.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from '@services/token.service';
const helperJWT = new JwtHelperService();

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  showPassword = false;
  status: RequestStatus = 'init';
  msgSSO: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UsersService,
    private authService: AuthService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private _notification: NotificationService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      const username = params.get('username');
      if (username) this.form.controls.username.setValue(username);
    });
  }

  doLogin() {
    if (this.form.valid) {
      this.status = 'loading';
      const { username, password } = this.form.getRawValue();
      this.authService.login(username, password).subscribe({
        next: async (rta) => {
          console.log("login rpta",rta)
          this.userService.getUserSessionActive(rta.id).subscribe((data)=>{
            console.log("login data rpta",data)
            if (data.code != 0) {
              this._notification.warning(data.message)
            }
            if (data.data) {
              localStorage.setItem('sigpsUser', JSON.stringify(data.data));
              this.status = 'success';
              this.router.navigate(['/app/admin']);
            }
            else{
              const decodeToken = helperJWT.decodeToken(this.tokenService.getToken()!);
              if (decodeToken.roles.includes('ADMIN')) {
                localStorage.setItem('sigpsUser', JSON.stringify(data.data));
                this.status = 'success';
                this.router.navigate(['/app/admin']);
              }
            }
            // this.router.navigate(['/app']);
            // console.log(JSON.parse(localStorage.getItem('sigpsUser')!));
          })
        },
        error: (rta) => {
          this._notification.error(rta.message)
          this.status = 'failed';
          this.msgSSO ='Problemas con la autenficación'
          if ( rta?.statusText === 'Bad credentials')
            this.msgSSO = 'Credenciales incorrectas'
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
