import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HorarioComponent } from './horario/horario.component';
import { HorarioAdministrarComponent } from './components/horario-administrar/horario-administrar.component';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { HorarioCrearComponent } from './components/horario-administrar/sub-components/horario-crear/horario-crear.component';
import { HorarioBuscarComponent } from './components/horario-buscar/horario-buscar.component';
import { HorarioConfiguracionComponent } from './components/horario-configuracion/horario-configuracion.component';
import { HorarioProgramacionComponent } from './components/horario-administrar/sub-components/horario-programacion/horario-programacion.component';

const routes: Routes = [
  {
    path: '',
    component: HorarioComponent,
    children:[
      {
        path: '',
        component: HorarioAdministrarComponent,
        title: 'Administrar Horarios'
      },
      {
        path: AppRoute.HORARIOS_BUSCAR,
        component: HorarioBuscarComponent,
        title: 'Buscar Horarios'
      },
      {
        path: AppRoute.HORARIOS_CONFIGURAR,
        component: HorarioConfiguracionComponent,
        title: 'Configurar Horarios'
      }
    ]
  },
  {
    path: AppRoute.CREAR_HORARIO,
    component: HorarioCrearComponent,
    title: 'Crear Horario'
  },
  {
    path: `${AppRoute.EDIT_HORARIO}/:idHorario`,
    component: HorarioProgramacionComponent,
    title: 'Programar tareas del Horario'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HorarioRoutingModule { }
