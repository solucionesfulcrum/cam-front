import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, RouterLink } from '@angular/router';
import { AfiliadosComponent } from './afiliados/afiliados.component';
import { ShowAfilComponent } from './show-afil/show-afil.component';
import { SubListActivacionesAfilComponent } from './show-afil/sub-list-activaciones-afil/sub-list-activaciones-afil.component';
import { AnalisisComponent } from './analisis/analisis.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { ShowSolComponent } from './show-sol/show-sol.component';
import { SubListActivacionesSolComponent } from './show-sol/sub-list-activaciones-sol/sub-list-activaciones-sol.component';
import { EditSolComponent } from './edit-sol/edit-sol.component';
import { EvaluacionComponent } from './evaluacion/evaluacion.component';
import { NewEvalAfiliadoComponent } from './components/new-eval-afiliado/new-eval-afiliado.component';
import { NewEval2AfiliadoComponent } from './components/new-eval2-afiliado/new-eval2-afiliado.component';
import { NewEval3AfiliadoComponent } from './components/new-eval3-afiliado/new-eval3-afiliado.component';
import { NewEval4AfiliadoComponent } from './components/new-eval4-afiliado/new-eval4-afiliado.component';
import { ResultEvalAfiliadoComponent } from './components/result-eval-afiliado/result-eval-afiliado.component';
import { AfilOperComponent } from './components/afil-oper/afil-oper.component';
import { TabsComponent } from './components/tabs/tabs.component';

const routes: Routes = [
  // { 
  //   path: '', 
  //   component: AfiliadosComponent,
  //   pathMatch: 'full',
  // },

  // {
  //   path: 'show/:id',
  //   component: ShowAfilComponent,
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: 'activaciones',
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: 'activaciones',
  //       component: SubListActivacionesAfilComponent,
  //     },
  //     {
  //       path: '**',
  //       redirectTo: 'activaciones',
  //     },
  //   ],
  // },
  { 
    path: 'afiliados', 
    component: AfiliadosComponent,
  },
  {
    path: 'afiliados/show/:id',
    component: ShowAfilComponent,
  },

  {
    path: 'showS/:id',
    component: ShowSolComponent,
    children: [
      {
        path: '',
        redirectTo: 'activaciones',
        pathMatch: 'full',
      },
      {
        path: 'activaciones',
        component: SubListActivacionesSolComponent,
      },
      {
        path: '**',
        redirectTo: 'activaciones',
      },
    ],
  },
  {
    path: 'afiliados/show/:id',
    component: ShowAfilComponent,
  },

  {
    path: 'afiliados/show/:id/activaciones',
    component: SubListActivacionesAfilComponent,
  },

  { 
    path: 'analisis', 
    component: AnalisisComponent,
  },
  { 
    path: '', 
    component: SolicitudesComponent,
  },
  {
    path: 'show/:tipoDoc/:numDoc',
    component: ShowSolComponent,
  },
  {
    path: 'editS/:id',
    component: EditSolComponent,
  },
  { 
    path: 'evaluacion', 
    component: EvaluacionComponent,
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
  { path: 'tabsAfil',
    component: TabsComponent,
  }
      /*children:[
      {path: '', component: AfiliadosComponent},
      {path: 'analisis', component: AnalisisComponent},
    ],*/
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AfiliadosRoutingModule {}



