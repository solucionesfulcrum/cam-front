import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { AuthComponent } from './auth/auth.component';
import { MantenimientoComponent } from './components/mantenimiento/mantenimiento.component';

const routes: Routes = [
  { 
    path:'',
    component:AuthComponent,
    children:[
      {
        path:'',
        redirectTo:'mantenimiento',
        pathMatch: 'full',
      },
      {
        path:'**',
        redirectTo:'mantenimiento',
        pathMatch: 'full',
      },
      { 
        path:'mantenimiento',
        component:MantenimientoComponent,
        title: 'mantenimiento'
      },
      { 
        path:'login',
        component:LoginComponent,
        title: 'Login'
      },
      { 
        path:'forgot-password',
        component:ForgotPasswordComponent,
        title: 'Forgot Password'
      },
      { 
        path:'register',
        component:RegisterComponent,
        title: 'Registrarse'
      },
      { 
        path:'recovery',
        component:RecoveryComponent,
        title: 'Recovery'
      }
    ],
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
