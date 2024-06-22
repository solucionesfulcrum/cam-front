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
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DialogConfirmSelectionComponent } from './contratos-layout/components/dialog/dialog-confirm-selection/dialog-confirm-selection.component';
import { ContratosRedListadoComponent } from './contratos-layout/components/contratos-red-listado/contratos-red-listado.component';
import { CdkTableModule } from '@angular/cdk/table';
import { DataLoadingComponent } from '@shared/components/data-loading/data-loading.component';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';
import { EstiloInputDirective } from 'src/app/directivas/estilo-input.directive';
import { EstiloLabelDirective } from 'src/app/directivas/estilo-label.directive';


@NgModule({
  declarations: [
    ContratosLayoutComponent,
    ContratosListadoComponent,
    ContratosAsignarServiciosComponent,
    ContratosResumenAsignacionComponent,
    DialogNewContratoComponent,
    DialogConfirmSelectionComponent,
    ContratosRedListadoComponent,
    EstiloInputDirective,
    EstiloLabelDirective
  ],
  imports: [
    CommonModule,
    ContratosRoutingModule,
    SharedModule,
    RouterModule,
    MaterialModule,
    DialogModule,
    CdkMenuModule,
    MatAutocompleteModule,
    CdkTableModule,
    DataLoadingComponent,
  ]
})
export class ContratosModule { }
