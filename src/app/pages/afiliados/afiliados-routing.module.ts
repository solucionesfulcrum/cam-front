import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AfiliadosComponent } from './afiliados/afiliados.component';
import { ShowAfilComponent } from './show-afil/show-afil.component';
import { SubListActivacionesAfilComponent } from './show-afil/sub-list-activaciones-afil/sub-list-activaciones-afil.component';
import { AnalisisComponent } from './analisis/analisis.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { ShowSolComponent } from './show-sol/show-sol.component';
import { SubListActivacionesSolComponent } from './show-sol/sub-list-activaciones-sol/sub-list-activaciones-sol.component';
import { EditSolComponent } from './edit-sol/edit-sol.component';
import { EvaluacionComponent } from './evaluacion/evaluacion.component';


const routes: Routes = [
  { 
    path: '', 
    component: AfiliadosComponent,
    pathMatch: 'full',
  },

  {
    path: 'show/:id',
    component: ShowAfilComponent,
    children: [
      {
        path: '',
        redirectTo: 'activaciones',
        pathMatch: 'full',
      },
      {
        path: 'activaciones',
        component: SubListActivacionesAfilComponent,
      },
      {
        path: '**',
        redirectTo: 'activaciones',
      },
    ],
  },
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
    path: 'afiliados', 
    component: AfiliadosComponent,
  },
  {
    path: 'afiliados/show/:id',
    component: ShowAfilComponent,
  },


  { 
    path: 'analisis', 
    component: AnalisisComponent,
  },
  { 
    path: 'solicitudes', 
    component: SolicitudesComponent,
  },
  {
    path: 'solicitudes/show/:id',
    component: ShowSolComponent,
  },
  {
    path: 'solicitudes/editS/:id',
    component: EditSolComponent,
  },
  { 
    path: 'evaluacion', 
    component: EvaluacionComponent,
  },

  
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



