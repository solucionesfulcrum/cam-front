import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlComponent } from './control/control.component'
import { ProgramadosComponent } from './components/programados/programados.component'

const routes: Routes = [
  {
    path: '',
    component: ControlComponent,
    children: [
      {
        path: '',
        component: ProgramadosComponent,
        title: 'Aperturar atención de citas'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlRoutingModule { }
