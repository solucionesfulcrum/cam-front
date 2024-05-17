import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ControlRoutingModule } from './control-routing.module';
import { ControlComponent } from './control/control.component';
import { ProgramadosComponent } from './components/programados/programados.component';
import { TabMisTalleresComponent } from './components/tab-mis-talleres/tab-mis-talleres.component';
import { TabAsistenciaComponent } from './components/tab-asistencia/tab-asistencia.component';
import { DialogConfirmDataAsistenciaComponent } from './components/tab-asistencia/dialog/dialog-confirm-data-asistencia/dialog-confirm-data-asistencia.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    ControlComponent,
    ProgramadosComponent,
    TabMisTalleresComponent,
    TabAsistenciaComponent,
    DialogConfirmDataAsistenciaComponent
  ],
  imports: [
    CommonModule,
    ControlRoutingModule,
    SharedModule,
    MatAutocompleteModule
  ]
})
export class ControlModule { }
