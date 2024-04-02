import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContratosLayoutComponent } from './contratos-layout/contratos-layout.component';
import { ContratosListadoComponent } from './contratos-layout/components/contratos-listado/contratos-listado.component';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { ContratosAsignarServiciosComponent } from './contratos-layout/components/contratos-asignar-servicios/contratos-asignar-servicios.component';
import { ContratosResumenAsignacionComponent } from './contratos-layout/components/contratos-resumen-asignacion/contratos-resumen-asignacion.component';

const routes: Routes = [
  {
    path: '',
    component: ContratosLayoutComponent,
    children: [
      {
        path: '',
        component: ContratosListadoComponent,
        title: 'Contratos - Listado'
      },
      {
        path: `${AppRoute.CONTRATOS_ASIGNAR_SERVICIOS}/:codOrden`,
        component: ContratosAsignarServiciosComponent,
        title: 'Contratos - Asignación'
      },
      {
        path: `${AppRoute.CONTRATOS_CONFIRMAR_SERVICIOS}/:codOrden`,
        component: ContratosResumenAsignacionComponent,
        title: 'Contratos - Resumen',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratosRoutingModule { }
