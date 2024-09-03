import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminContactosComponent } from './admin-contactos/admin-contactos.component';
import { AseguradosComponent } from './components/asegurados/asegurados.component';
import { EvaluacionesComponent } from './components/evaluaciones/evaluaciones.component';

const routes: Routes = [
  {
    component: AdminContactosComponent,
    path: '',
    children: [
      {
        path: 'asegurados',
        component: AseguradosComponent
      },
      {
        path: 'evaluaciones',
        component: EvaluacionesComponent
      },
      {
        path: '',
        redirectTo: 'asegurados',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminContactosRoutingModule { }
