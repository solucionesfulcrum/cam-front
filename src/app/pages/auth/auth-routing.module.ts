import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { AuthComponent } from './auth/auth.component';
import { MantenimientoComponent } from './components/mantenimiento/mantenimiento.component';
import { environment } from '@environments/environment';

let routes: Routes = [];

if (environment.mantenimiento) {
  routes = [
    {
      path: '',
      component: AuthComponent,
      children: [
        { 
          path: 'mantenimiento',
          component: MantenimientoComponent,
          title: 'Mantenimiento'
        },
        { 
          path: '',
          redirectTo: 'mantenimiento',
          pathMatch: 'full',
        }
      ]
    }
  
  ];
} else {
  routes = [
    { 
      path: '',
      component: AuthComponent,
      children: [
        {
          path: '',
          redirectTo: 'login',
          pathMatch: 'full',
        },
        { 
          path: 'login',
          component: LoginComponent,
          title: 'Login'
        },
        { 
          path: 'forgot-password',
          component: ForgotPasswordComponent,
          title: 'Forgot Password'
        },
        { 
          path: 'register',
          component: RegisterComponent,
          title: 'Registrarse'
        },
        { 
          path: 'recovery',
          component: RecoveryComponent,
          title: 'Recovery'
        },
        { 
          path: '*',
          redirectTo: 'login',
          pathMatch: 'full',
        }
      ],
    }
  ];
}


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
