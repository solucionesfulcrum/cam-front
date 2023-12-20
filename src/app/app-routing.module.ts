import { HomeComponent } from './pages/home/home.component';
import { ProgramacionTalleresComponent } from './pages/programacion-talleres/programacion-talleres.component';
import { AsistenciaTalleresLayoutComponent } from './pages/asistencia-talleres/asistencia-talleres-layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, RouterLink } from '@angular/router';
import { CamsLayoutComponent } from './pages/cams/cams-layout.component';
import { AfiliadosLayoutComponent } from './pages/afiliados/afiliados-layout.component';
import { AseguradosLayoutComponent } from './pages/asegurados/asegurados-layout.component';
import { EventosLayoutComponent } from './pages/eventos/eventos-layout.component';
import { PlanificacionLayoutComponent } from './pages/planificacion/planificacion-layout.component';
import { ReportesLayoutComponent } from './pages/reportes/reportes-layout.component';
import { TalleresLayoutComponent } from './pages/talleres/talleres-layout.component';
import { UsersLayoutComponent } from './pages/users/users-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { OpcionRegresarComponent } from '@shared/components/opcion-regresar/opcion-regresar.component';
import { NewEvalAfiliadoComponent } from './pages/afiliados/components/new-eval-afiliado/new-eval-afiliado.component';
import { NewEval2AfiliadoComponent } from './pages/afiliados/components/new-eval2-afiliado/new-eval2-afiliado.component';
import { NewEval3AfiliadoComponent } from './pages/afiliados/components/new-eval3-afiliado/new-eval3-afiliado.component';
import { NewEval4AfiliadoComponent } from './pages/afiliados/components/new-eval4-afiliado/new-eval4-afiliado.component';
import { ResultEvalAfiliadoComponent } from './pages/afiliados/components/result-eval-afiliado/result-eval-afiliado.component';
import { AfilOperComponent } from './pages/afiliados/components/afil-oper/afil-oper.component';
import { TabsComponent } from './pages/afiliados/components/tabs/tabs.component';
import { RedirectGuard } from './guards/redirect.guard';


const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: '',
    canActivate: [RedirectGuard],
    loadChildren: () => import('./pages/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'app',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./layout/layout.module').then((m) => m.LayoutModule)
  },

  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },

  {
    path: 'regresar',
    component: OpcionRegresarComponent,
  },
  {
    path: 'agregaEval',
    component: NewEvalAfiliadoComponent,
    
  },
  {
    path: 'agregaEval2',
    component: NewEval2AfiliadoComponent,
    
  },
  {
    path: 'agregaEval3',
    component: NewEval3AfiliadoComponent,
    
  },
  {
    path: 'agregaEval4',
    component: NewEval4AfiliadoComponent,
    
  },
  {
    path: 'resultEval',
    component: ResultEvalAfiliadoComponent,
    
  },
  {
    path: 'afiliadOper',
    component: AfilOperComponent,
    
  },
  {
    path: 'tabsAfil',
    component: TabsComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
