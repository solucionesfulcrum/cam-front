import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlComponent } from './control/control.component'
import { ProgramadosComponent } from './components/programados/programados.component'
import { TabMisTalleresComponent } from './components/tab-mis-talleres/tab-mis-talleres.component';
import { TabAsistenciaComponent } from './components/tab-asistencia/tab-asistencia.component';
import { ControlAsistenciaGuard } from '@guards/control-asistencia.guard';
import { TabAsistenciaProfCamComponent } from './components/tab-asistencia-prof-cam/tab-asistencia-prof-cam.component';

const routes: Routes = [
  {
    path: '',
    component: ControlComponent,
    children: [
      {
        path: '',
        component: ProgramadosComponent,
        title: 'Talleres programados'
      },
      {
        path: 'mis-talleres',
        component: TabMisTalleresComponent,
        title: 'Listado mis talleres'
      },
      {
        path: 'control-asistencia',
        canActivate:[ControlAsistenciaGuard],
        component: TabAsistenciaComponent,
        title: 'Control de Asistencia'
      },
      {
        path: 'asistencias-profesional-cam',
        canActivate:[ControlAsistenciaGuard],
        component: TabAsistenciaProfCamComponent,
        title: 'Control de Asistencia'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlRoutingModule { }
