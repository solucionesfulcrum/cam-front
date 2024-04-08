import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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


@NgModule({
  declarations: [
    ProgramacionLayoutComponent,
    TabContratosComponent,
    TabTalleresComponent,
    TabCalendarioComponent,
    ProgramacionShowContratoComponent
  ],
  imports: [
    CommonModule,
    ProgramacionRoutingModule,
    CdkTableModule,
    SharedModule,
    MaterialModule,
    MatAutocompleteModule
  ]
})
export class ProgramacionModule { }
