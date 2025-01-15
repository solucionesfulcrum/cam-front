import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '@shared/shared.module';
import { DashboardAfiliadosComponent } from './component/dashboard-afiliados/dashboard-afiliados.component'
import { CdkTableModule } from '@angular/cdk/table';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardAsistenciasComponent } from './component/dashboard-asistencias/dashboard-asistencias.component';
import { DashboardAsistenciasRapidasComponent } from './component/dashboard-asistencias-rapidas/dashboard-asistencias-rapidas.component';
import { DashboardAsistenciasProgramadasComponent } from './component/dashboard-asistencias-programadas/dashboard-asistencias-programadas.component';
import { LocaleService } from 'ngx-daterangepicker-material';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardAfiliadosComponent,
    DashboardAsistenciasComponent,
    DashboardAsistenciasRapidasComponent,
    DashboardAsistenciasProgramadasComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CdkTableModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
  ]
})
export class DashboardModule { }
