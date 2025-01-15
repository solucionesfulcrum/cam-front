import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { ReportesTalleristaComponent } from './reportes-tallerista/reportes-tallerista.component';
import { TalleresComponent } from './talleres/talleres.component';
import { DetalleAsistenciasTallerComponent } from './detalle-asistencias-taller/detalle-asistencias-taller.component';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { ReporteAsistenciasProgramadasComponent } from './components/reporte-asistencias-programadas/reporte-asistencias-programadas.component';
import { ReporteAsistenciaRapidaComponent } from './components/reporte-asistencia-rapida/reporte-asistencia-rapida.component';

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
      },
      {
        path : AppRoute.REPORTES_ASISTENCIAS_PROGRAMADAS,
        component: ReporteAsistenciasProgramadasComponent
      },
      {
        path : AppRoute.REPORTES_ASISTENCIA_RAPIDA,
        component: ReporteAsistenciaRapidaComponent
      }
    ]
  }
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesTalleristaRoutingModule { }
