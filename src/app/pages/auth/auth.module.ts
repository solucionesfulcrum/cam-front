import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '@shared/components/btn/button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackgroundComponent } from './components/background/background.component';
import { FooterComponent } from './components/footer/footer.component';
import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RecoveryFormComponent } from './components/recovery-form/recovery-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '@shared/shared.module';
import { NgStepperModule } from 'angular-ng-stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { DialogCodigoActivacionComponent } from './components/dialog-codigo-activacion/dialog-codigo-activacion.component';
import { DialogModule } from '@angular/cdk/dialog';
import { ToastrModule, ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    RecoveryComponent,
    BackgroundComponent,
    FooterComponent,
    ForgotPasswordFormComponent,
    HeaderComponent,
    LoginFormComponent,
    RecoveryFormComponent,
    RegisterFormComponent,
    DialogCodigoActivacionComponent
  ],
  imports: [
    CommonModule,
    ToastrModule.forRoot(),
    AuthRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    SharedModule,
    DialogModule,
    CdkStepperModule,
    NgStepperModule
  ],
  providers: [
    {provide: ToastrService, useClass: ToastrService}
  ]
})
export class AuthModule { }
