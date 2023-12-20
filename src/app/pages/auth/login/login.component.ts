import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Logueo } from 'src/app/core/_model/auth/login';
import { AuthService } from '../services/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from 'src/app/shared/services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    username: [''],
    password: [''],
  });
  hide = true;
  loading!: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authSvc: AuthService,
    private toastrSvc: ToastrService,
    private utilSvc: UtilsService
  ) {}

  ngOnInit(): void {}

  onLogin(): void {
    const formValue = this.loginForm.value;
    this.loading = true;
    this.authSvc.login(formValue).subscribe({
      next: (resp:any) => {
        console.log("success login from SSO.-.... ", resp);


        this.authSvc.getUsuarioFromSistema(resp.id).subscribe({
            next: (resp:any) => {
              console.log("success login from SYSTEM .... ", resp);
              this.authSvc.guardarLocalStorageForSistema(resp.unidadOperativa, resp.tipoUnidad, resp.nombreUnidad)
            },
            error: (resp) => {
              console.log("NO ENCONTRADO userlogin from SYSTEM .... ", resp);
              this.authSvc.guardarLocalStorageForSistema("15", "1", "R.P. REBAGLIATI")
            },
          });


        this.utilSvc.openSidenav(true);
        this.router.navigate(['/app/home']);
      },
      error: (error) => {
        console.log(error);
        let msgText = 'Problemas con la autentificación' 
        if ( error.message === 'Bad credentials')
          msgText = 'Credenciales incorrectas'
        this.toastrSvc.error(msgText);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
    
  }

  irRegistroUsuario(): void {
    this.router.navigate(['/registro']);
  }

  irOlvidoPassword(): void {
    this.router.navigate(['/olvido-password']);
  }
}
