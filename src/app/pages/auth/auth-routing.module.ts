import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { AuthComponent } from './auth/auth.component';
import { MantenimientoComponent } from './components/mantenimiento/mantenimiento.component';
import { environment } from '@environments/environment';
import { MantenimientoGuard } from '@guards/mantenimiento.guard';

// Función que verifica si hay un secretKeyPass en los query params y si coincide con el esperado
function isMaintenanceBypassed(): { existe: boolean, iguales: boolean } {
  const params = new URLSearchParams(window.location.search); // Obtener parámetros de la URL
  const secretKeyPass = params.get('secretKeyPass'); // Obtener el parámetro 'secretKeyPass'
  const expectedSecretKey = 'kusG2dkMa2oacXnZAm4vqpt6OSRblTGj'; // Valor esperado para el parámetro
  return {
    existe: secretKeyPass != null,                // True si el parámetro existe
    iguales: secretKeyPass === expectedSecretKey  // True si el parámetro coincide con el valor esperado
  };
}

let routes: Routes = [];

if (
  (environment.mantenimiento && !isMaintenanceBypassed().existe) || 
  (environment.mantenimiento && !isMaintenanceBypassed().iguales)
) {
  // Redirigir siempre a mantenimiento si está activo y no se ha bypassed
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
  // Rutas normales si no está en mantenimiento o se ha bypassed
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
          title: 'Login',
          canActivate: [MantenimientoGuard], // Aplica el guard aquí
        },
        { 
          path: 'forgot-password',
          component: ForgotPasswordComponent,
          title: 'Forgot Password',
          canActivate: [MantenimientoGuard], // Aplica el guard aquí
        },
        { 
          path: 'register',
          component: RegisterComponent,
          title: 'Registrarse',
          canActivate: [MantenimientoGuard], // Aplica el guard aquí
        },
        { 
          path: 'recovery',
          component: RecoveryComponent,
          title: 'Recovery',
          canActivate: [MantenimientoGuard], // Aplica el guard aquí
        },
        { 
          path: 'mantenimiento',
          component: MantenimientoComponent,
          title: 'Mantenimiento',
        }
      ],
    }
  ];
}

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
