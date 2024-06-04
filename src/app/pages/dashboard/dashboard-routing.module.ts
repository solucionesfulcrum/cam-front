import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardAfiliadosComponent } from './component/dashboard-afiliados/dashboard-afiliados.component';
import { DashboardAsistenciasComponent } from './component/dashboard-asistencias/dashboard-asistencias.component';

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
      }
    ]
  }
  ];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
