import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsistenciaRapidaComponent } from './asistencia-rapida/asistencia-rapida.component';
import { TalleristasAsistenciaRapidaComponent } from './components/talleristas-asistencia-rapida/talleristas-asistencia-rapida.component';
import { ProfCamAsistenciaRapidaComponent } from './components/prof-cam-asistencia-rapida/prof-cam-asistencia-rapida.component';
import { UoAsistenciaRapidaComponent } from './components/uo-asistencia-rapida/uo-asistencia-rapida.component';

const routes: Routes = [
  {
    component: AsistenciaRapidaComponent,
    path: '',
    children: [
      {
        path: '',
        component: TalleristasAsistenciaRapidaComponent
       },
     {
      path: 'talleristas',
      component: TalleristasAsistenciaRapidaComponent
     },
     {
      path: 'profesional-cam',
      component: ProfCamAsistenciaRapidaComponent
     },
     {
      path: 'unidades-operativas',
      component: UoAsistenciaRapidaComponent
     }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsistenciaRapidaRoutingModule { }
