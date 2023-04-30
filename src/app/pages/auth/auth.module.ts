import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroComponent } from './registro/registro.component';
import { OlvidoPasswordComponent } from './olvido-password/olvido-password.component';
import { CambioPasswordComponent } from './modals/cambio-password/cambio-password.component';
import { RegistroCodigoComponent } from './modals/registro-codigo/registro-codigo.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
//import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelect } from '@angular/material/select';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegistroComponent,
    OlvidoPasswordComponent,
    CambioPasswordComponent,
    RegistroCodigoComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    //NgxMatSelectSearchModule,
  ]
})
export class AuthModule { }
