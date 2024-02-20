import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import LocaleEsPe from '@angular/common/locales/es-PE.js';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from '@interceptors/token.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { SharedModule } from '@shared/shared.module';

// registerLocaleData(LocaleEsPe);

// @NgModule({
//   declarations: [AppComponent],
//   imports: [
//     CommonModule,
//     AppRoutingModule,
//     BrowserModule,
//     BrowserAnimationsModule,
//     HttpClientModule,
//     RouterModule,
//     SharedModule
//   ],
//   bootstrap: [AppComponent],
//   providers: [
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: TokenInterceptor,
//       multi: true,
//     },
//     {
//       provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
//       useValue: { appearance: 'outline' },
//     },
//   ],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA],
// })
export class AppModule { }
