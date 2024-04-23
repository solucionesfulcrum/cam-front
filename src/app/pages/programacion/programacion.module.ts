import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ProgramacionRoutingModule } from './programacion-routing.module';
import { ProgramacionLayoutComponent } from './programacion-layout/programacion-layout.component';
import { TabContratosComponent } from './components/tab-contratos/tab-contratos.component';
import { TabTalleresComponent } from './components/tab-talleres/tab-talleres.component';
import { TabCalendarioComponent } from './components/tab-calendario/tab-calendario.component';
import { CdkTableModule } from '@angular/cdk/table';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProgramacionShowContratoComponent } from './components/tab-contratos/components/programacion-show-contrato/programacion-show-contrato.component';
import { ProgramacionTabContratadosComponent } from './components/tab-contratos/components/programacion-show-contrato/tabs/programacion-tab-contratados/programacion-tab-contratados.component';
import { ProgramacionTabProgramadosComponent } from './components/tab-contratos/components/programacion-show-contrato/tabs/programacion-tab-programados/programacion-tab-programados.component';
import { CalendarioProgramacionComponent } from './components/tab-contratos/components/programacion-show-contrato/tabs/programacion-tab-contratados/sub-components/calendario-programacion/calendario-programacion.component';
import { DialogAddProgramacionAsignacionComponent } from './components/tab-contratos/components/programacion-show-contrato/tabs/programacion-tab-contratados/sub-components/dialogs/dialog-add-programacion-asignacion/dialog-add-programacion-asignacion.component';


@NgModule({
  declarations: [
    ProgramacionLayoutComponent,
    TabContratosComponent,
    TabTalleresComponent,
    TabCalendarioComponent,
    ProgramacionShowContratoComponent,
    ProgramacionTabContratadosComponent,
    ProgramacionTabProgramadosComponent,
    CalendarioProgramacionComponent,
    DialogAddProgramacionAsignacionComponent
  ],
  imports: [
    CommonModule,
    ProgramacionRoutingModule,
    CdkTableModule,
    SharedModule,
    MaterialModule,
    MatAutocompleteModule
  ],
  providers: [
    DatePipe
  ]
})
export class ProgramacionModule { }
