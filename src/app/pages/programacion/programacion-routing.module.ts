import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgramacionLayoutComponent } from './programacion-layout/programacion-layout.component';
import { TabContratosComponent } from './components/tab-contratos/tab-contratos.component';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { TabCalendarioComponent } from './components/tab-calendario/tab-calendario.component';
import { TabTalleresComponent } from './components/tab-talleres/tab-talleres.component';
import { ProgramacionShowContratoComponent } from './components/tab-contratos/components/programacion-show-contrato/programacion-show-contrato.component';

const routes: Routes = [
  {
    path: '',
    component: ProgramacionLayoutComponent,
    children: [
      {
        path: '',
        component: TabContratosComponent,
        title: 'Programación - Listado de Contratos'
      },
      {
        path: 'show/:numOc',
        component: ProgramacionShowContratoComponent,
        title: 'Programación - Contrato'
      },
      {
        path: `${AppRoute.PROGRAMACION_TAB_TALLERES.split('/')[1]}`,
        component: TabTalleresComponent,
        title: 'Programación - Listado de Talleres'
      },
      {
        path: `${AppRoute.PROGRAMACION_TAB_CALENDARIOS.split('/')[1]}`,
        component: TabCalendarioComponent,
        title: 'Programación - Listado de Calendarios'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramacionRoutingModule { }
