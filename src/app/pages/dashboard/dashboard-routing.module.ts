import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardAfiliadosComponent } from './component/dashboard-afiliados/dashboard-afiliados.component';
import { DashboardAsistenciasComponent } from './component/dashboard-asistencias/dashboard-asistencias.component';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { DashboardAsistenciasRapidasComponent } from './component/dashboard-asistencias-rapidas/dashboard-asistencias-rapidas.component';
import { DashboardAsistenciasProgramadasComponent } from './component/dashboard-asistencias-programadas/dashboard-asistencias-programadas.component';

const routes: Routes = [
  {path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: DashboardAfiliadosComponent,
        title: 'Dashboard - Afiliados'
      },
      {
        path: 'asistencias',
        component: DashboardAsistenciasComponent,
        title: 'Dashboard - Afiliados'
      },
      {
        path: AppRoute.DASHBOARD_ASISTENCIAS_RAPIDAS,
        component: DashboardAsistenciasRapidasComponent,
        title: 'Dashboard - Asistencias Rápidas'
      },
      {
        path: AppRoute.DASHBOARD_ASISTENCIAS_PROGRAMADAS,
        component: DashboardAsistenciasProgramadasComponent,
        title: 'Dashboard - Asistencias Programadas'
      }
    ]
  }
  ];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
