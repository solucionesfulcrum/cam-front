import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContratosRoutingModule } from './contratos-routing.module';
import { ContratosLayoutComponent } from './contratos-layout/contratos-layout.component';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogModule } from '@angular/cdk/dialog';
import { ContratosListadoComponent } from './contratos-layout/components/contratos-listado/contratos-listado.component';
import { ContratosAsignarServiciosComponent } from './contratos-layout/components/contratos-asignar-servicios/contratos-asignar-servicios.component';
import { ContratosResumenAsignacionComponent } from './contratos-layout/components/contratos-resumen-asignacion/contratos-resumen-asignacion.component';
import { DialogNewContratoComponent } from './contratos-layout/components/dialog/dialog-new-contrato/dialog-new-contrato.component';


@NgModule({
  declarations: [
    ContratosLayoutComponent,
    ContratosListadoComponent,
    ContratosAsignarServiciosComponent,
    ContratosResumenAsignacionComponent,
    DialogNewContratoComponent
  ],
  imports: [
    CommonModule,
    ContratosRoutingModule,
    SharedModule,
    RouterModule,
    MaterialModule,
    DialogModule
  ]
})
export class ContratosModule { }
