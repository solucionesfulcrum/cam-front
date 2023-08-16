import { HomeComponent } from './pages/home/home.component';
import { ProgramacionTalleresComponent } from './pages/programacion-talleres/programacion-talleres.component';
import { AsistenciaTalleresLayoutComponent } from './pages/asistencia-talleres/asistencia-talleres-layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamsLayoutComponent } from './pages/cams/cams-layout.component';
import { AfiliadosLayoutComponent } from './pages/afiliados/afiliados-layout.component';
import { AseguradosLayoutComponent } from './pages/asegurados/asegurados-layout.component';
import { EventosLayoutComponent } from './pages/eventos/eventos-layout.component';
import { PlanificacionLayoutComponent } from './pages/planificacion/planificacion-layout.component';
import { ReportesLayoutComponent } from './pages/reportes/reportes-layout.component';
import { TalleresLayoutComponent } from './pages/talleres/talleres-layout.component';
import { UsersLayoutComponent } from './pages/users/users-layout.component';
import { AuthGuard } from './shared/services/auth.guard';

const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: '',
    loadChildren: () => import('./pages/auth/auth.module').then((m) => m.AuthModule)
  },

  { path: 'home',
    canActivate: [AuthGuard],
    title: 'CAM - INICIO',
    component: HomeComponent 
  },

  //{ path: 'asistencia-talleres', component: AsistenciaTalleresComponent },

  //{ path: 'programacion-talleres', component: ProgramacionTalleresComponent },

  {
    path: 'planificacion',
    title: 'CAM - PLANIFICACION',
    canActivate: [AuthGuard],
    component:PlanificacionLayoutComponent,
    loadChildren: () =>  import('./pages/planificacion/planificacion.module').then(  (m) => m.PlanificacionModule  ),
  },
  {
    path: 'usuarios',
    title: 'CAM - USUARIOS',
    canActivate: [AuthGuard],
    component:UsersLayoutComponent,
    loadChildren: () =>  import('./pages/users/users.module').then(  (m) => m.UsersModule),
  },
  {
    path: 'cams',
    title: 'CAM - CAMS',
    canActivate: [AuthGuard],
    component:CamsLayoutComponent,
    loadChildren: () =>  import('./pages/cams/cams.module').then(  (m) => m.CamsModule),
  },
  {
    path: 'asegurados',
    title: 'CAM - ASEGURADOS',
    canActivate: [AuthGuard],
    component:AseguradosLayoutComponent,
    loadChildren: () =>  import('./pages/asegurados/asegurados.module').then(  (m) => m.AseguradosModule),
  },
  {
    path: 'talleres',
    title: 'CAM - TALLERES',
    canActivate: [AuthGuard],
    component:TalleresLayoutComponent,
    loadChildren: () =>  import('./pages/talleres/talleres.module').then(  (m) => m.TalleresModule),
  },
  {
    path: 'eventos',
    title: 'CAM - EVENTOS',
    canActivate: [AuthGuard],
    component:EventosLayoutComponent,
    loadChildren: () =>  import('./pages/eventos/eventos.module').then(  (m) => m.EventosModule),
  },
  {
    component:AfiliadosLayoutComponent,
    path: 'afiliados',
    title: 'CAM - AFILIADOS',
    canActivate: [AuthGuard],
    loadChildren: () =>  import('./pages/afiliados/afiliados.module').then(  (m) => m.AfiliadosModule),
  },
  {
    path: 'reportes',
    component:ReportesLayoutComponent,
    title: 'CAM - REPORTES',
    canActivate: [AuthGuard],
    loadChildren: () =>  import('./pages/reportes/reportes.module').then(  (m) => m.ReportesModule),
  },

  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
