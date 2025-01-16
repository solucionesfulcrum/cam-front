import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParametrosComponent } from './parametros/parametros.component';
import { ListaParametrosComponent } from './components/lista-parametros/lista-parametros.component';

const routes: Routes = [
  {
    'path': '',
    component: ParametrosComponent,
    children: [
      {
        path: '',
        redirectTo: 'lista-parametros',
        pathMatch: 'full'
      },
      {
        path: 'lista-parametros',
        component: ListaParametrosComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosRoutingModule { }
