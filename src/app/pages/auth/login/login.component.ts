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
      next: (resp) => {
        console.log(resp);
        this.utilSvc.openSidenav(true);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.log(error);
        this.toastrSvc.error(error.message);
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
