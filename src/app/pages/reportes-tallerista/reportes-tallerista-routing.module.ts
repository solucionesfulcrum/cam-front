import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { ReportesTalleristaComponent } from './reportes-tallerista/reportes-tallerista.component';
import { TalleresComponent } from './talleres/talleres.component';
import { DetalleAsistenciasTallerComponent } from './detalle-asistencias-taller/detalle-asistencias-taller.component';

const routes: Routes = [
  {
    path: '',
    component: ReportesTalleristaComponent,
    children: [
      {
        path : '',
        component: TalleresComponent
      },
      {
        path : 'talleres',
        component: TalleresComponent
      },
      {
        path : 'detalle-taller/:idProgramacion',
        component: DetalleAsistenciasTallerComponent
      }
    ]
  }
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesTalleristaRoutingModule { }
