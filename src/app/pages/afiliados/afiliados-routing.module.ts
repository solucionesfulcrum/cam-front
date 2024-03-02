import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, RouterLink } from '@angular/router';
import { AfiliadosComponent } from './afiliados/afiliados.component';
import { AnalisisComponent } from './analisis/analisis.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { ShowSolComponent } from './show-sol/show-sol.component';
import { SubListActivacionesSolComponent } from './show-sol/sub-list-activaciones-sol/sub-list-activaciones-sol.component';
import { EditSolComponent } from './edit-sol/edit-sol.component';
import { EvaluacionComponent } from './evaluacion/evaluacion.component';
import { AfilOperComponent } from './components/afil-oper/afil-oper.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { AfiliadosLayoutComponent } from './afiliados-layout.component';
import { EvaluacionLayoutComponent } from './components/evaluacion-layout/evaluacion-layout.component';
import { EvaluacionAPfeifferComponent } from './components/evaluacion-layout/evaluaciones/evaluacion-a-pfeiffer/evaluacion-a-pfeiffer.component';
import { EvaluacionBKatzComponent } from './components/evaluacion-layout/evaluaciones/evaluacion-b-katz/evaluacion-b-katz.component';
import { EvaluacionCGijonComponent } from './components/evaluacion-layout/evaluaciones/evaluacion-c-gijon/evaluacion-c-gijon.component';
import { EvaluacionDYesavageComponent } from './components/evaluacion-layout/evaluaciones/evaluacion-d-yesavage/evaluacion-d-yesavage.component';
import { ContenedorEvaluacionComponent } from './components/evaluacion-layout/evaluaciones/contenedor-evaluacion/contenedor-evaluacion.component';
import { EvaluacionResultadosComponent } from './components/evaluacion-layout/evaluaciones/evaluacion-resultados/evaluacion-resultados.component';

const routes: Routes = [
  {
    path: '',
    component: AfiliadosLayoutComponent,
    children:[
      {
        path: '',
        component: SolicitudesComponent,
        title: 'Afiliaciones - Solicitudes'
      },
      {
        path: 'evaluacion',
        children:[
          {
            path: '',
            component: EvaluacionComponent,
            title: 'Afiliaciones - Evaluación'
          },
          {
            path: 'agregaEval',
            component: ContenedorEvaluacionComponent,
            children: [
              {
                path: '',
                component: EvaluacionLayoutComponent,
                children:[
                  {
                    path: '',
                    component: EvaluacionAPfeifferComponent,
                    title: 'Test Pfeiffer'
                  },
                  {
                    path: 'eva-katz',
                    component: EvaluacionBKatzComponent,
                    title: 'Test de Katz'
                  },
                  {
                    path: 'eva-gijon',
                    component: EvaluacionCGijonComponent,
                    title: 'Escala de Gijón'
                  },
                  {
                    path: 'eva-yesavage',
                    component: EvaluacionDYesavageComponent,
                    title: 'Test Yesavage'
                  }
                ]
              },
              {
                path: 'resultados',
                component: EvaluacionResultadosComponent,

              }
            ]
          }
        ]
      },
      {
        path: 'show/:idSolicitud',
        component: ShowSolComponent,
      }
    ]
  }
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
  // { 
  //   path: '', 
  //   component: AfiliadosComponent,
  // },
  // {
  //   path: 'show/:id',
  //   component: ShowAfilComponent,
  // },

  // {
  //   path: 'showS/:id',
  //   component: ShowSolComponent,
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: 'activaciones',
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: 'activaciones',
  //       component: SubListActivacionesSolComponent,
  //     },
  //     {
  //       path: '**',
  //       redirectTo: 'activaciones',
  //     },
  //   ],
  // },

  // {
  //   path: 'show/:id/activaciones',
  //   component: SubListActivacionesAfilComponent,
  // },

  // { 
  //   path: 'analisis', 
  //   component: AnalisisComponent,
  // },
  // { 
  //   path: '', 
  //   component: SolicitudesComponent,
  // },
  // {
  //   path: 'show/:tipoDoc/:numDoc',
  //   component: ShowSolComponent,
  // },
  // {
  //   path: 'editS/:id',
  //   component: EditSolComponent,
  // },
  // { 
  //   path: 'evaluacion', 
  //   component: EvaluacionComponent,
  // },
  // {
  //   path: 'agregaEval',
  //   component: NewEvalAfiliadoComponent,
  // },
  // {
  //   path: 'agregaEval2',
  //   component: NewEval2AfiliadoComponent,
  // },
  // {
  //   path: 'agregaEval3',
  //   component: NewEval3AfiliadoComponent,
  // },
  // {
  //   path: 'agregaEval4',
  //   component: NewEval4AfiliadoComponent,
  // },
  // {
  //   path: 'resultEval',
  //   component: ResultEvalAfiliadoComponent,
  // },
  // {
  //   path: 'afiliadOper',
  //   component: AfilOperComponent,
  // },
  // { path: 'tabsAfil',
  //   component: TabsComponent,
  // }
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



