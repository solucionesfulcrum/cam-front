import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardAfiliadosComponent } from './component/dashboard-afiliados/dashboard-afiliados.component';

const routes: Routes = [
  {path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: DashboardAfiliadosComponent,
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
